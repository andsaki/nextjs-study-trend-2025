# ADR 002: Zustand採用によるUI状態管理

## ステータス

採用 (Accepted)

## コンテキスト

Next.js App RouterとTanStack Queryを使用したTodoアプリケーションにおいて、UI状態（検索フォーム表示、検索パラメータなど）の管理方法を決定する必要がある。

### 状態管理の分類

アプリケーションには2種類の状態がある:

1. **サーバー状態**: API経由で取得するデータ（Todos、詳細情報など）
   - → TanStack Queryで管理（ADR 001参照）

2. **UI状態**: クライアント側のみで管理する状態
   - 検索フォームの表示/非表示
   - 検索パラメータ（キーワード、フィルタ、ソート）
   - モーダルの開閉状態
   - タブの選択状態

### 課題

- `useState`のみでは複数コンポーネント間で状態共有が困難
- Prop Drillingが深くなる
- URL同期が必要（検索パラメータ）
- 永続化が必要な状態がある（検索フォーム表示状態）

## 決定事項

**Zustand を採用し、グローバルなUI状態管理を行う。**

サーバー状態はTanStack Query、UI状態はZustandという明確な責務分離を行う。

## 理由

### 1. シンプルで直感的なAPI

**比較**:

```tsx
// ❌ Context API（ボイラープレート多い）
const SearchContext = createContext()

function SearchProvider({ children }) {
  const [searchParams, setSearchParams] = useState({})
  const [showSearch, setShowSearch] = useState(false)

  return (
    <SearchContext.Provider value={{ searchParams, setSearchParams, showSearch, setShowSearch }}>
      {children}
    </SearchContext.Provider>
  )
}

// 使用側
const { searchParams, setSearchParams } = useContext(SearchContext)

// ✅ Zustand（シンプル）
export const useTodoSearchStore = create((set) => ({
  searchParams: {},
  showSearch: false,
  setSearchParams: (params) => set({ searchParams: params }),
  toggleShowSearch: () => set((state) => ({ showSearch: !state.showSearch })),
}))

// 使用側
const { searchParams, setSearchParams, toggleShowSearch } = useTodoSearchStore()
```

### 2. セレクタによる最適な再レンダリング

**パフォーマンス最適化**:

```tsx
// 必要な状態だけ取得→その状態が変わった時だけ再レンダリング
const searchParams = useTodoSearchStore((state) => state.searchParams)
const showSearch = useTodoSearchStore((state) => state.showSearch)

// 全体を取得も可能
const { searchParams, showSearch, setSearchParams } = useTodoSearchStore()
```

### 3. ミドルウェアによる拡張性

#### Devtools ミドルウェア

```tsx
import { devtools } from 'zustand/middleware'

export const useTodoSearchStore = create(
  devtools(
    (set) => ({
      searchParams: {},
      setSearchParams: (params) =>
        set({ searchParams: params }, false, 'setSearchParams'),
    })
  )
)
```

Redux DevToolsで状態変更を追跡可能:
- アクション履歴
- Time-travel debugging
- 状態のスナップショット

#### Persist ミドルウェア

```tsx
import { persist } from 'zustand/middleware'

export const useTodoSearchStore = create(
  persist(
    (set) => ({
      showSearch: false,
      toggleShowSearch: () => set((state) => ({ showSearch: !state.showSearch })),
    }),
    {
      name: 'todo-search-storage',
      partialize: (state) => ({ showSearch: state.showSearch }),
    }
  )
)
```

- localStorageに自動保存
- ページリロード後も状態維持
- `partialize`で永続化する状態を選択可能

### 4. TypeScript完全サポート

```tsx
interface TodoSearchState {
  searchParams: TodoSearchParams
  showSearch: boolean
  setSearchParams: (params: TodoSearchParams) => void
  updateSearchParam: <K extends keyof TodoSearchParams>(
    key: K,
    value: TodoSearchParams[K]
  ) => void
  resetSearchParams: () => void
  toggleShowSearch: () => void
  setShowSearch: (show: boolean) => void
}

export const useTodoSearchStore = create<TodoSearchState>()(...)
```

### 5. バンドルサイズが小さい

| ライブラリ | サイズ (gzipped) |
|-----------|------------------|
| Zustand | 1.2 KB |
| Redux + RTK | 12 KB |
| MobX | 16 KB |
| Recoil | 14 KB |

### 6. React 18/19対応

- Concurrent Rendering対応
- Suspense対応
- Server Componentsと併用可能

## 実装詳細

### Store定義 (`lib/store/useTodoSearchStore.ts`)

```tsx
import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import type { TodoSearchParams } from "@/lib/api/todos"

interface TodoSearchState {
  // 状態
  searchParams: TodoSearchParams
  showSearch: boolean

  // アクション
  setSearchParams: (params: TodoSearchParams) => void
  updateSearchParam: <K extends keyof TodoSearchParams>(
    key: K,
    value: TodoSearchParams[K]
  ) => void
  resetSearchParams: () => void
  toggleShowSearch: () => void
  setShowSearch: (show: boolean) => void
}

const defaultSearchParams: TodoSearchParams = {
  sortBy: "createdAt",
  sortOrder: "desc",
}

export const useTodoSearchStore = create<TodoSearchState>()(
  devtools(
    persist(
      (set) => ({
        // 初期状態
        searchParams: defaultSearchParams,
        showSearch: false,

        // アクション
        setSearchParams: (params) =>
          set({ searchParams: params }, false, "setSearchParams"),

        updateSearchParam: (key, value) =>
          set(
            (state) => ({
              searchParams: { ...state.searchParams, [key]: value },
            }),
            false,
            "updateSearchParam"
          ),

        resetSearchParams: () =>
          set({ searchParams: defaultSearchParams }, false, "resetSearchParams"),

        toggleShowSearch: () =>
          set((state) => ({ showSearch: !state.showSearch }), false, "toggleShowSearch"),

        setShowSearch: (show) =>
          set({ showSearch: show }, false, "setShowSearch"),
      }),
      {
        name: "todo-search-storage",
        // URLと同期するので検索パラメータは永続化しない
        partialize: (state) => ({ showSearch: state.showSearch }),
      }
    )
  )
)
```

### 使用例 (`app/todos/page.tsx`)

```tsx
'use client'

import { useTodoSearchStore } from '@/lib/store/useTodoSearchStore'
import { useTodos } from '@/lib/hooks/useTodos'

export default function TodosPage() {
  // Zustand store（UI状態）
  const {
    searchParams,
    showSearch,
    setSearchParams,
    toggleShowSearch,
  } = useTodoSearchStore()

  // TanStack Query（サーバー状態）
  const { data: todos, isLoading } = useTodos(searchParams)

  const handleSearch = (params: TodoSearchParams) => {
    setSearchParams(params)
    // URLも更新
    router.push(`/todos?${new URLSearchParams(params).toString()}`)
  }

  return (
    <div>
      <Button onClick={toggleShowSearch}>
        {showSearch ? '検索を閉じる' : '検索'}
      </Button>

      {showSearch && (
        <SearchForm onSearch={handleSearch} defaultValues={searchParams} />
      )}

      <TodoList todos={todos} />
    </div>
  )
}
```

## URL同期パターン

```tsx
// URLパラメータとZustand storeの双方向同期
useEffect(() => {
  const params = {}
  const q = searchParamsFromUrl.get('q')
  const priority = searchParamsFromUrl.get('priority')

  if (q) params.q = q
  if (priority) params.priority = priority

  // URLからstoreに反映
  setSearchParams(params)

  if (Object.keys(params).length > 0) {
    setShowSearch(true)
  }
}, [searchParamsFromUrl])

// storeからURLに反映
const handleSearch = (params) => {
  setSearchParams(params)

  const urlParams = new URLSearchParams()
  if (params.q) urlParams.set('q', params.q)
  if (params.priority) urlParams.set('priority', params.priority)

  router.push(`/todos?${urlParams.toString()}`)
}
```

## TanStack Queryとの責務分離

```tsx
// ✅ 明確な責務分離

// Zustand: UI状態
const { showSearch, toggleShowSearch } = useTodoSearchStore()

// TanStack Query: サーバー状態
const { data: todos, isLoading, error } = useTodos(searchParams)
const updateMutation = useUpdateTodo()
```

| 状態 | 管理方法 | 理由 |
|------|---------|------|
| `todos[]` | TanStack Query | サーバーから取得、キャッシュ必要 |
| `isLoading` | TanStack Query | サーバー通信の状態 |
| `searchParams` | Zustand | UI状態、URL同期 |
| `showSearch` | Zustand | UI状態、永続化 |
| `selectedTab` | Zustand | UI状態 |
| `modalOpen` | Zustand | UI状態 |

## トレードオフ

### デメリット

1. **追加の依存関係**: `zustand` のインストールが必要
2. **学習コスト**: storeの設計、ミドルウェアの理解が必要
3. **グローバル状態の管理**: 適切な粒度の設計が重要

### メリット

1. **シンプルなAPI**: `useState`とほぼ同じ感覚
2. **小さいバンドルサイズ**: 1.2KB
3. **高いパフォーマンス**: セレクタによる最適な再レンダリング
4. **拡張性**: ミドルウェアで機能追加
5. **開発体験**: DevTools、TypeScript完全サポート

## 代替案

### 1. useState + Context API

**却下理由**:
- ボイラープレートが多い
- プロバイダーのネストが深くなる
- パフォーマンス最適化が手動

### 2. Redux Toolkit

**却下理由**:
- オーバースペック（本アプリケーションには不要な機能が多い）
- バンドルサイズが大きい（12KB vs 1.2KB）
- ボイラープレートが多い

### 3. Recoil

**却下理由**:
- まだExperimental
- バンドルサイズが大きい（14KB）
- メンテナンスが不安定

### 4. Jotai

**検討した理由**:
- 軽量（3KB）
- Atomベースでシンプル

**却下理由**:
- Zustandの方がDevTools統合が簡単
- ミドルウェアエコシステムが充実
- コミュニティが大きい

## ベストプラクティス

### 1. Store分割

```tsx
// ❌ 1つの巨大なstore
export const useAppStore = create((set) => ({
  todos: [],
  searchParams: {},
  user: {},
  theme: 'light',
  // ...100個の状態
}))

// ✅ 機能ごとに分割
export const useTodoSearchStore = create(...)
export const useUserStore = create(...)
export const useThemeStore = create(...)
```

### 2. アクションの命名

```tsx
// ✅ 明確なアクション名
setSearchParams: (params) => set({ searchParams: params })
updateSearchParam: (key, value) => set(...)
resetSearchParams: () => set({ searchParams: {} })
toggleShowSearch: () => set((state) => ({ showSearch: !state.showSearch }))
```

### 3. Devtoolsでのアクション追跡

```tsx
set({ searchParams: params }, false, 'setSearchParams')
//                            ^^^^^ replace   ^^^^^^^^^^^^^ action name
```

## 結果

Zustandの採用により以下を実現:

1. ✅ 検索フォーム表示状態のグローバル管理
2. ✅ 検索パラメータの複数コンポーネント共有
3. ✅ localStorageへの自動永続化
4. ✅ Redux DevToolsでのデバッグ
5. ✅ TypeScriptによる型安全な状態管理

## 参考資料

- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Zustand vs Redux](https://github.com/pmndrs/zustand#comparison)
- [State Management Best Practices](https://kentcdodds.com/blog/application-state-management-with-react)

## 更新履歴

- 2025-11-06: 初版作成
