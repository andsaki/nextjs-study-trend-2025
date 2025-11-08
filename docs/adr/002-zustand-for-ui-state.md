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

### useStateとの使い分け

**重要**: すべての状態をZustandで管理する必要はない。useStateとZustandを適切に使い分ける。

```tsx
// ✅ useState（ローカル状態）
function TodoForm() {
  const [title, setTitle] = useState('') // ← このコンポーネントだけで使う
  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <form>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
    </form>
  )
}

// ✅ Zustand（グローバル状態）
const useAppStore = create((set) => ({
  sidebarOpen: false, // ← 複数コンポーネントで共有
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}))

function Sidebar() {
  const { sidebarOpen } = useAppStore() // 状態を参照
  // ...
}

function Header() {
  const { toggleSidebar } = useAppStore() // アクションを使用
  // ...
}
```

**判断基準**:

| 状態の特徴 | 推奨 | 理由 |
|-----------|------|------|
| 1つのコンポーネントだけで使う | **useState** | シンプル、オーバーヘッドなし |
| 親子関係（1-2階層）で共有 | **useState + props** | Prop drilling許容範囲 |
| 複数の無関係なコンポーネントで共有 | **Zustand** | Prop drilling回避 |
| ページリロード後も保持したい | **Zustand + persist** | localStorage自動同期 |
| URLと同期したい | **Zustand + router** | 検索パラメータ等 |
| フォーム入力中の一時的な値 | **useState** or **React Hook Form** | ローカルで完結 |
| モーダル開閉、サイドバー開閉 | **Zustand** | 複数箇所から操作 |

**具体例**:

```tsx
// ❌ アンチパターン: ローカル状態をZustandに
const useFormStore = create((set) => ({
  title: '',
  setTitle: (title: string) => set({ title }),
}))

function TodoForm() {
  const { title, setTitle } = useFormStore()
  // → オーバーエンジニアリング、useStateで十分
}

// ✅ 正しい: ローカル状態はuseState
function TodoForm() {
  const [title, setTitle] = useState('')
  // → シンプルで明快
}

// ✅ 正しい: グローバル状態はZustand
const useModalStore = create((set) => ({
  isOpen: false,
  todoId: null,
  open: (todoId: string) => set({ isOpen: true, todoId }),
  close: () => set({ isOpen: false, todoId: null }),
}))

function TodoList() {
  const { open } = useModalStore()
  return <button onClick={() => open('123')}>詳細</button>
}

function TodoDetailModal() {
  const { isOpen, todoId, close } = useModalStore()
  // 別のコンポーネントツリーにあっても状態共有可能
}
```

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

## 代替案の比較表

| 項目 | Zustand | Redux Toolkit | Recoil | Jotai | Context API |
|------|---------|---------------|--------|-------|-------------|
| **バンドルサイズ** | 1.2 KB | 17.5 KB | 14 KB | 3 KB | 0 KB (内蔵) |
| **学習曲線** | ⭐⭐⭐ 緩やか | ⭐ 急 | ⭐ 急 | ⭐⭐ やや急 | ⭐⭐⭐ 緩やか |
| **ボイラープレート** | ⭐⭐⭐ 少ない | ⭐ 多い | ⭐⭐ やや多い | ⭐⭐ やや多い | ⭐⭐ 中程度 |
| **Provider必要** | ❌ 不要 | ✅ 必要 | ✅ 必要 | △ オプション | ✅ 必要 |
| **DevTools** | ⭐⭐⭐ 簡単 | ⭐⭐⭐ 強力 | ⭐⭐ 可能 | ⭐⭐ やや手間 | ⭐ 難しい |
| **TypeScript** | ⭐⭐⭐ 完全 | ⭐⭐⭐ 完全 | ⭐⭐⭐ 完全 | ⭐⭐⭐ 完全 | ⭐⭐ 手動 |
| **パフォーマンス** | ⭐⭐⭐ 高速 | ⭐⭐⭐ 高速 | ⭐⭐⭐ 高速 | ⭐⭐⭐ 高速 | ⭐⭐ 要最適化 |
| **永続化** | ⭐⭐⭐ 簡単 | ⭐⭐ 可能 | ⭐⭐ 可能 | ⭐⭐ 可能 | ⭐ 手動 |
| **ミドルウェア** | ⭐⭐⭐ 豊富 | ⭐⭐⭐ 豊富 | ⭐⭐ 限定的 | ⭐⭐ 限定的 | ❌ なし |
| **コミュニティ** | ⭐⭐⭐ 大 | ⭐⭐⭐ 最大 | ⭐⭐ 中 | ⭐⭐ 中 | ⭐⭐⭐ React内蔵 |
| **メンテナンス** | ⭐⭐⭐ 活発 | ⭐⭐⭐ 活発 | ⭐ 不安定 | ⭐⭐⭐ 活発 | ⭐⭐⭐ React公式 |
| **状態管理モデル** | 集中型 | 集中型 | Atom分散型 | Atom分散型 | Context分散型 |
| **Next.js App Router適性** | ⭐⭐⭐ 最適 | ⭐⭐ 可能 | ⭐⭐ 可能 | ⭐⭐⭐ 良好 | ⭐⭐ 可能 |
| **本プロジェクト適性** | ⭐⭐⭐ 最適 | ⭐ オーバースペック | ⭐ オーバースペック | ⭐⭐ やや過剰 | ⭐⭐ シンプル過ぎ |

### 詳細な評価

### 1. useState + Context API

React標準のContext APIとuseStateを組み合わせた状態管理パターン。

**実装例**:

```tsx
// ❌ Context API（ボイラープレートが多い）
import { createContext, useContext, useState, ReactNode } from 'react'

// 1. Context作成
interface TodoSearchContextType {
  searchParams: TodoSearchParams
  showSearch: boolean
  setSearchParams: (params: TodoSearchParams) => void
  toggleShowSearch: () => void
}

const TodoSearchContext = createContext<TodoSearchContextType | undefined>(undefined)

// 2. Provider作成
export function TodoSearchProvider({ children }: { children: ReactNode }) {
  const [searchParams, setSearchParams] = useState<TodoSearchParams>({})
  const [showSearch, setShowSearch] = useState(false)

  const toggleShowSearch = () => setShowSearch((prev) => !prev)

  return (
    <TodoSearchContext.Provider
      value={{ searchParams, showSearch, setSearchParams, toggleShowSearch }}
    >
      {children}
    </TodoSearchContext.Provider>
  )
}

// 3. カスタムフック作成
export function useTodoSearch() {
  const context = useContext(TodoSearchContext)
  if (!context) {
    throw new Error('useTodoSearch must be used within TodoSearchProvider')
  }
  return context
}

// 4. Providerを配置
export default function RootLayout({ children }) {
  return (
    <TodoSearchProvider>
      {children}
    </TodoSearchProvider>
  )
}

// 5. 使用側
function SearchForm() {
  const { searchParams, setSearchParams, toggleShowSearch } = useTodoSearch()
  // ...
}

// ✅ Zustand（シンプル）
// 1ファイル、約20行
export const useTodoSearchStore = create((set) => ({
  searchParams: {},
  showSearch: false,
  setSearchParams: (params) => set({ searchParams: params }),
  toggleShowSearch: () => set((state) => ({ showSearch: !state.showSearch })),
}))

// すぐに使える
const { searchParams, setSearchParams } = useTodoSearchStore()
```

**却下理由**:

#### 1. ボイラープレートが多い

| 項目 | Context API | Zustand |
|------|-------------|---------|
| ファイル数 | 3ファイル | 1ファイル |
| コード行数 | 約50行 | 約20行 |
| 必要な概念 | Context、Provider、useContext、useState | create、set |

#### 2. Providerのネスト地獄

```tsx
// ❌ 複数のContextを使うと...
export default function RootLayout({ children }) {
  return (
    <TodoSearchProvider>
      <UserProvider>
        <ThemeProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </ThemeProvider>
      </UserProvider>
    </TodoSearchProvider>
  )
}

// ✅ Zustand（Providerなし）
// 何も追加不要、各コンポーネントで直接import
const { searchParams } = useTodoSearchStore()
const { user } = useUserStore()
const { theme } = useThemeStore()
```

#### 3. パフォーマンス問題

```tsx
// ❌ Context APIの問題（すべての値が変わると全体が再レンダリング）
const TodoSearchContext = createContext({ searchParams: {}, showSearch: false })

function ComponentA() {
  const { searchParams } = useContext(TodoSearchContext)
  // showSearchが変わってもComponentAが再レンダリングされる
}

function ComponentB() {
  const { showSearch } = useContext(TodoSearchContext)
  // searchParamsが変わってもComponentBが再レンダリングされる
}

// 解決策: Contextを分割（さらにボイラープレート増加）
const SearchParamsContext = createContext({})
const ShowSearchContext = createContext(false)

// ✅ Zustand（セレクタで最適化）
function ComponentA() {
  const searchParams = useTodoSearchStore((state) => state.searchParams)
  // searchParamsが変わった時だけ再レンダリング
}

function ComponentB() {
  const showSearch = useTodoSearchStore((state) => state.showSearch)
  // showSearchが変わった時だけ再レンダリング
}
```

#### 4. TypeScript型安全性の手動設定

```tsx
// ❌ Context API（型定義が分散）
interface TodoSearchContextType {
  searchParams: TodoSearchParams
  showSearch: boolean
  setSearchParams: (params: TodoSearchParams) => void
  toggleShowSearch: () => void
}

const TodoSearchContext = createContext<TodoSearchContextType | undefined>(undefined)

export function useTodoSearch() {
  const context = useContext(TodoSearchContext)
  if (!context) {
    throw new Error('useTodoSearch must be used within TodoSearchProvider')
  }
  return context
}

// ✅ Zustand（型定義が自然）
interface TodoSearchState {
  searchParams: TodoSearchParams
  showSearch: boolean
  setSearchParams: (params: TodoSearchParams) => void
  toggleShowSearch: () => void
}

export const useTodoSearchStore = create<TodoSearchState>()((set) => ({
  searchParams: {},
  showSearch: false,
  setSearchParams: (params) => set({ searchParams: params }),
  toggleShowSearch: () => set((state) => ({ showSearch: !state.showSearch })),
}))
```

#### 5. DevToolsの欠如

Context APIには標準のDevToolsがなく、デバッグが困難。

#### 6. 永続化の手動実装

```tsx
// ❌ Context API（手動で実装）
export function TodoSearchProvider({ children }: { children: ReactNode }) {
  const [showSearch, setShowSearch] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('showSearch')
      return saved ? JSON.parse(saved) : false
    }
    return false
  })

  useEffect(() => {
    localStorage.setItem('showSearch', JSON.stringify(showSearch))
  }, [showSearch])

  // ...
}

// ✅ Zustand（ミドルウェア1行）
export const useTodoSearchStore = create(
  persist(
    (set) => ({ showSearch: false, /* ... */ }),
    { name: 'todo-search-storage' }
  )
)
```

#### 7. Next.js App Routerでの制約

```tsx
// ❌ Context APIの場合（Client Componentが必須）
'use client'

export function TodoSearchProvider({ children }) {
  // すべての子コンポーネントがClient Componentになる
}

// ✅ Zustand（必要な箇所だけClient Component）
// サーバーコンポーネント
async function TodosPage() {
  return (
    <div>
      <SearchFormClient /> {/* これだけClient Component */}
      <TodoList /> {/* Server Componentのまま */}
    </div>
  )
}
```

**Context APIが適しているケース**:

- 非常にシンプルなアプリ（1-2個の状態）
- 外部依存を避けたい
- テーマ、ロケール（i18n）など、読み取り専用が多い状態
- Reactの学習目的

**却下理由まとめ**:

本プロジェクトでは以下の理由でContext APIを却下:
- ボイラープレートが2.5倍（50行 vs 20行）
- Providerのネストが深くなる
- パフォーマンス最適化に手動実装が必要
- DevToolsがない
- 永続化の手動実装が必要
- Next.js App Routerとの相性が悪い

### 2. Redux Toolkit

Redux/Redux Toolkit (RTK) は長年にわたりReactの状態管理のデファクトスタンダードとして使用されてきた強力なライブラリ。

**Redux Toolkitの特徴**:
- 単一ストア、不変性、予測可能な状態管理
- 強力なDevTools（Time-travel debugging）
- 大規模なエコシステム（ミドルウェア、拡張機能）
- Redux Toolkit による従来のボイラープレート削減

**却下理由**:

#### 1. オーバースペックな機能セット

本アプリケーションの要件（検索フォーム表示、検索パラメータ、モーダル状態）に対して、Reduxが提供する機能（グローバル単一ストア、アクション・リデューサーパターン、ミドルウェアシステム、Time-travel debugging）は過剰。

```tsx
// ❌ Redux Toolkit（オーバースペック）
// 1. Sliceの定義
const todoSearchSlice = createSlice({
  name: 'todoSearch',
  initialState: { searchParams: {}, showSearch: false },
  reducers: {
    setSearchParams: (state, action) => {
      state.searchParams = action.payload
    },
    toggleShowSearch: (state) => {
      state.showSearch = !state.showSearch
    },
  },
})

// 2. Storeの設定
const store = configureStore({
  reducer: { todoSearch: todoSearchSlice.reducer },
})

// 3. Providerの設定
<Provider store={store}>{children}</Provider>

// 4. 使用側
const dispatch = useDispatch()
const searchParams = useSelector((state) => state.todoSearch.searchParams)
dispatch(setSearchParams({ q: 'test' }))

// ✅ Zustand（シンプル）
export const useTodoSearchStore = create((set) => ({
  searchParams: {},
  showSearch: false,
  setSearchParams: (params) => set({ searchParams: params }),
  toggleShowSearch: () => set((state) => ({ showSearch: !state.showSearch })),
}))

const { searchParams, setSearchParams } = useTodoSearchStore()
```

#### 2. バンドルサイズの比較

| ライブラリ | サイズ (gzipped) | 比較 |
|-----------|------------------|------|
| **Zustand** | **1.2 KB** | **基準** |
| Redux Core | 3.3 KB | 2.75倍 |
| Redux Toolkit | 12 KB | 10倍 |
| React-Redux | 5.5 KB | 4.6倍 |
| **合計 (RTK + React-Redux)** | **17.5 KB** | **14.6倍** |

初期ロード時間の増加、モバイルユーザーへの影響、Lighthouseスコアへのネガティブな影響が懸念される。

#### 3. ボイラープレートの量

**Redux Toolkit**: 約80行（4ファイル: types.ts, slice.ts, store.ts, hooks.ts）
**Zustand**: 約20行（1ファイル）

```tsx
// Redux Toolkitの場合
// types.ts
interface TodoSearchState {
  searchParams: TodoSearchParams
  showSearch: boolean
}

// slice.ts
const todoSearchSlice = createSlice({
  name: 'todoSearch',
  initialState: { searchParams: {}, showSearch: false } as TodoSearchState,
  reducers: {
    setSearchParams: (state, action: PayloadAction<TodoSearchParams>) => {
      state.searchParams = action.payload
    },
    toggleShowSearch: (state) => {
      state.showSearch = !state.showSearch
    },
  },
})

export const { setSearchParams, toggleShowSearch } = todoSearchSlice.actions

// store.ts
const store = configureStore({
  reducer: { todoSearch: todoSearchSlice.reducer },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// hooks.ts
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// 使用側
const dispatch = useAppDispatch()
const searchParams = useAppSelector((state) => state.todoSearch.searchParams)
dispatch(setSearchParams({ q: 'test' }))

// Zustandの場合
// store.ts
interface TodoSearchState {
  searchParams: TodoSearchParams
  showSearch: boolean
  setSearchParams: (params: TodoSearchParams) => void
  toggleShowSearch: () => void
}

export const useTodoSearchStore = create<TodoSearchState>((set) => ({
  searchParams: {},
  showSearch: false,
  setSearchParams: (params) => set({ searchParams: params }),
  toggleShowSearch: () => set((state) => ({ showSearch: !state.showSearch })),
}))

// 使用側
const { searchParams, setSearchParams } = useTodoSearchStore()
```

#### 4. 学習曲線

**Redux Toolkitの学習コスト**:
1. Reduxの基本概念（Store, Action, Reducer, Dispatch）
2. `createSlice`のAPI
3. `configureStore`の設定
4. TypeScript型定義（RootState, AppDispatch）
5. `useSelector`と`useDispatch`のパターン
6. Immerの理解（内部で使用）
7. ミドルウェアの概念（必要に応じて）

**Zustandの学習コスト**:
1. `create`関数の使い方
2. 基本的な`set`関数
3. セレクタパターン（オプション）

#### 5. RTK Queryの重複

Redux Toolkitには**RTK Query**という強力なデータフェッチライブラリが含まれているが、本プロジェクトでは**TanStack Query**を既に採用している（ADR 001参照）。

```tsx
// すでにTanStack Queryを使用
const { data: todos } = useTodos(searchParams)
const updateMutation = useUpdateTodo()

// RTK Queryを使うと重複
const { data: todos } = useGetTodosQuery(searchParams)
const [updateTodo] = useUpdateTodoMutation()
```

**問題点**:
- 2つのデータフェッチライブラリが共存
- 学習コストの増加
- バンドルサイズの増加
- キャッシュ戦略の不一致

#### 6. Next.js App Routerとの相性

Next.js App RouterはデフォルトでServer Componentsであり、クライアント状態は最小限にすべき。

```tsx
// ❌ Reduxの場合（Providerが必要、すべてClient Component化）
'use client'
import { Provider } from 'react-redux'

export default function RootLayout({ children }) {
  return <Provider store={store}>{children}</Provider>
}

// ✅ Zustandの場合（Providerが不要）
'use client'
// 必要なコンポーネントだけクライアント化
function SearchForm() {
  const { searchParams, setSearchParams } = useTodoSearchStore()
  // ...
}
```

#### 7. 現代の状態管理トレンド

**2025年のトレンド**:
- **サーバー状態**: TanStack Query、SWR
- **UI状態**: Zustand、Jotai（軽量・シンプル）
- **Redux**: 大規模・複雑なアプリケーション向け

**本アプリケーションの規模**:
- 小〜中規模のTodoアプリ
- 状態は主にサーバー状態（TanStack Queryで管理）
- UI状態は最小限（検索フォーム、モーダル）

**Redux/RTKが適しているケース**:

以下の場合はRedux/RTKの採用を検討すべき:

1. **大規模アプリケーション**: 100+コンポーネント、50+アクション、複雑な状態遷移、多数の開発者
2. **複雑なビジネスロジック**: 複数のアクションが連鎖する場合
3. **厳格な状態管理が必要**: 金融システム、医療システム、監査ログが必要なシステム
4. **既存のReduxエコシステムが必要**: Redux Saga（複雑な非同期フロー）、Redux Persist（高度な永続化）
5. **チームの経験**: 全員がReduxに慣れている、新メンバーがRedux経験者

**将来的な再検討ポイント**:

以下の状況になった場合、Reduxへの移行を再検討:
- コンポーネント数が200+に達した場合
- 複雑な状態遷移ロジックが増えた場合
- Redux Sagaが必要な非同期フローが登場した場合
- 厳格な監査ログが必要になった場合
- チーム全員がRedux経験者になった場合

### 3. Recoil

Facebookが開発したAtomベースの状態管理ライブラリ。

**Recoilの特徴**:
- Atomパターン（分散的な状態管理）
- React Suspense/Concurrent Mode対応
- 非同期状態のネイティブサポート
- グラフベースの状態依存関係

**実装例**:

```tsx
// Recoilの場合
import { atom, useRecoilState, selector } from 'recoil'

// Atom定義
const searchParamsState = atom({
  key: 'searchParams',
  default: {},
})

const showSearchState = atom({
  key: 'showSearch',
  default: false,
})

// Selector（派生状態）
const filteredTodosState = selector({
  key: 'filteredTodos',
  get: ({ get }) => {
    const params = get(searchParamsState)
    const todos = get(todosState)
    return todos.filter(/* ... */)
  },
})

// 使用側
function SearchForm() {
  const [searchParams, setSearchParams] = useRecoilState(searchParamsState)
  const [showSearch, setShowSearch] = useRecoilState(showSearchState)
  // ...
}

// ✅ Zustandの場合（シンプル）
export const useTodoSearchStore = create((set) => ({
  searchParams: {},
  showSearch: false,
  setSearchParams: (params) => set({ searchParams: params }),
  toggleShowSearch: () => set((state) => ({ showSearch: !state.showSearch })),
}))

const { searchParams, setSearchParams } = useTodoSearchStore()
```

**却下理由**:

#### 1. まだExperimental（実験的）

```tsx
// package.json
{
  "name": "recoil",
  "version": "0.7.7", // 1.0未満
  "description": "Recoil - A state management library for React"
}
```

- 2025年時点でも正式版（v1.0）未リリース
- APIが変更される可能性
- プロダクション利用にはリスクがある

#### 2. メンテナンスが不安定

| 項目 | Recoil | Zustand |
|------|--------|---------|
| GitHub Stars | 19k | 46k |
| 週間ダウンロード | 500k | 5.5M |
| 最終更新 | 不定期 | 活発 |
| メンテナー | Meta（優先度低）| pmndrs（専任） |

Meta社内では使われているが、オープンソースとしての優先度は低い。

#### 3. バンドルサイズが大きい

| ライブラリ | サイズ (gzipped) | 比較 |
|-----------|------------------|------|
| **Zustand** | **1.2 KB** | **基準** |
| Recoil | 14 KB | 11.7倍 |

#### 4. Providerが必要

```tsx
// ❌ Recoilの場合（Providerが必須）
import { RecoilRoot } from 'recoil'

export default function RootLayout({ children }) {
  return (
    <RecoilRoot>
      {children}
    </RecoilRoot>
  )
}

// ✅ Zustandの場合（Providerが不要）
// 何も追加不要、すぐに使える
```

Next.js App RouterではClient Componentの範囲を最小化したいため、グローバルなProviderは避けたい。

#### 5. 学習曲線

**Recoilの概念**:
- Atom（状態の単位）
- Selector（派生状態）
- AtomFamily（動的なAtom生成）
- SelectorFamily（動的なSelector生成）
- useRecoilState、useRecoilValue、useSetRecoilState
- Snapshot（状態のスナップショット）

**Zustandの概念**:
- `create`でストア作成
- `set`で状態更新
- セレクタ（オプション）

#### 6. 本アプリケーションには不要な機能

Recoilの強み:
```tsx
// Atomベースの細かい状態管理（不要）
const userIdState = atom({ key: 'userId', default: null })
const userNameState = atom({ key: 'userName', default: '' })
const userAgeState = atom({ key: 'userAge', default: 0 })
// → 本アプリでは検索パラメータとモーダル状態だけ

// 複雑な派生状態（不要）
const complexSelector = selector({
  key: 'complex',
  get: ({ get }) => {
    const a = get(atomA)
    const b = get(atomB)
    const c = get(atomC)
    return calculateSomethingComplex(a, b, c)
  }
})
// → TanStack Queryで十分

// 非同期Selector（不要）
const asyncUserState = selector({
  key: 'user',
  get: async () => {
    const response = await fetch('/api/user')
    return response.json()
  }
})
// → TanStack Queryで管理
```

**Recoilが適しているケース**:
- 複雑な派生状態が多い大規模アプリ
- 状態間の依存関係がグラフ構造になる
- React Suspenseを積極的に活用したい
- Meta社内と同様の環境を構築したい

### 4. Jotai

Recoilにインスパイアされた軽量版Atomベースライブラリ。

**Jotaiの特徴**:
- Atomベースのシンプルな設計
- Providerオプショナル（グローバルでも使える）
- TypeScript完全サポート
- 軽量（3KB）

**実装例**:

```tsx
// Jotaiの場合
import { atom, useAtom } from 'jotai'

// Atom定義
const searchParamsAtom = atom({})
const showSearchAtom = atom(false)

// 派生Atom
const toggleShowSearchAtom = atom(
  (get) => get(showSearchAtom),
  (get, set) => set(showSearchAtom, !get(showSearchAtom))
)

// 使用側
function SearchForm() {
  const [searchParams, setSearchParams] = useAtom(searchParamsAtom)
  const [showSearch, toggleShowSearch] = useAtom(toggleShowSearchAtom)
  // ...
}

// ✅ Zustandの場合（より直感的）
export const useTodoSearchStore = create((set) => ({
  searchParams: {},
  showSearch: false,
  setSearchParams: (params) => set({ searchParams: params }),
  toggleShowSearch: () => set((state) => ({ showSearch: !state.showSearch })),
}))

const { searchParams, setSearchParams, toggleShowSearch } = useTodoSearchStore()
```

**検討した理由**:
- 軽量（3KB、Zustandの2.5倍だが許容範囲）
- Atomベースでシンプル
- TypeScript完全サポート
- 活発なメンテナンス

**却下理由**:

#### 1. DevTools統合の手間

```tsx
// ❌ Jotaiの場合（別途設定が必要）
import { useAtomDevtools } from 'jotai-devtools'

function DebugAtoms() {
  useAtomDevtools(searchParamsAtom, 'searchParams')
  useAtomDevtools(showSearchAtom, 'showSearch')
  // すべてのAtomに対して設定が必要
}

// ✅ Zustandの場合（ミドルウェア1行）
export const useTodoSearchStore = create(
  devtools((set) => ({
    // すべての状態が自動的にDevToolsに表示される
  }))
)
```

#### 2. Atomの分散管理

```tsx
// ❌ Jotaiの場合（Atomが分散）
const searchParamsAtom = atom({})
const showSearchAtom = atom(false)
const modalOpenAtom = atom(false)
const selectedTabAtom = atom('all')
// → 関連する状態がバラバラに定義される

// ✅ Zustandの場合（関連状態を1箇所に）
export const useTodoSearchStore = create((set) => ({
  searchParams: {},
  showSearch: false,
  modalOpen: false,
  selectedTab: 'all',
  // すべての関連状態とアクションが1箇所に
}))
```

#### 3. 永続化の実装

```tsx
// ❌ Jotaiの場合（atomWithStorageを使うが制約あり）
import { atomWithStorage } from 'jotai/utils'

const showSearchAtom = atomWithStorage('showSearch', false)
// 問題: 部分的な永続化（partialize）が難しい

// ✅ Zustandの場合（柔軟な永続化）
export const useTodoSearchStore = create(
  persist(
    (set) => ({
      searchParams: {},  // 永続化しない
      showSearch: false, // 永続化する
    }),
    {
      name: 'todo-search-storage',
      partialize: (state) => ({ showSearch: state.showSearch }), // 選択的に永続化
    }
  )
)
```

#### 4. コミュニティとエコシステム

| 項目 | Jotai | Zustand |
|------|-------|---------|
| GitHub Stars | 18k | 46k |
| 週間ダウンロード | 500k | 5.5M |
| ミドルウェア | 限定的 | 豊富 |
| 学習リソース | 少ない | 豊富 |

#### 5. API の直感性

```tsx
// Jotaiの場合（write関数が必要）
const incrementAtom = atom(
  (get) => get(countAtom),
  (get, set, newValue) => set(countAtom, newValue + 1)
)

// Zustandの場合（通常の関数）
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}))
```

Zustandの方が`useState`に近く、学習コストが低い。

#### 6. 本アプリケーションの要件とのミスマッチ

**本アプリの要件**:
- 検索パラメータ（オブジェクト）
- モーダル開閉（boolean）
- 検索フォーム表示（boolean）

**Jotaiの強み**:
- 多数の小さなAtomを組み合わせる
- 複雑な派生状態
- Atomの動的生成（atomFamily）

→ 本アプリにはオーバースペック

**Jotaiが適しているケース**:
- 状態が細かく分散している
- 多数の派生状態が必要
- Atomベースの思考モデルを好む
- Recoilの軽量版が欲しい

**結論**:

Jotaiは優れたライブラリだが、本プロジェクトでは:
- Zustandの方がDevTools統合が簡単
- ミドルウェアエコシステムが充実
- コミュニティが大きく、学習リソースが豊富
- APIがより直感的で学習コストが低い
- 関連状態を1箇所にまとめられる

よってZustandを採用。

### 5. React Hook Form（フォーム状態管理）

React Hook Formはフォーム専用の状態管理ライブラリで、UI状態管理とは異なる責務を持つ。

**React Hook Formの特徴**:
- フォーム入力値の管理
- バリデーション（Zodと連携）
- エラー状態の管理
- 非制御コンポーネントによる高パフォーマンス

**Zustandとの使い分け**:

| 状態の種類 | 管理方法 | 理由 |
|-----------|---------|------|
| **フォーム入力値** | React Hook Form | 入力中の一時的な状態、バリデーション |
| **検索パラメータ（確定後）** | Zustand | 複数コンポーネント共有、URL同期 |
| **モーダル開閉** | Zustand | グローバルUI状態 |
| **検索フォーム表示** | Zustand | 永続化が必要なUI状態 |

**実装例**:

```tsx
// ✅ React Hook Form + Zustand の連携
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTodoSearchStore } from '@/lib/store/useTodoSearchStore'

const searchSchema = z.object({
  q: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  status: z.enum(['pending', 'completed']).optional(),
})

type SearchFormData = z.infer<typeof searchSchema>

function SearchForm() {
  // Zustand: 確定済みの検索パラメータ
  const { searchParams, setSearchParams } = useTodoSearchStore()

  // React Hook Form: 入力中のフォーム状態
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: searchParams, // Zustandから初期値を取得
  })

  const onSubmit = (data: SearchFormData) => {
    // バリデーション成功後、Zustandに保存
    setSearchParams(data)

    // URLも更新
    const urlParams = new URLSearchParams()
    if (data.q) urlParams.set('q', data.q)
    if (data.priority) urlParams.set('priority', data.priority)
    router.push(`/todos?${urlParams.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('q')} placeholder="検索" />
      {errors.q && <span>{errors.q.message}</span>}

      <select {...register('priority')}>
        <option value="">すべて</option>
        <option value="low">低</option>
        <option value="medium">中</option>
        <option value="high">高</option>
      </select>

      <button type="submit">検索</button>
    </form>
  )
}
```

**なぜZustandだけでは不十分か**:

```tsx
// ❌ Zustandだけで管理すると...
const { searchParams, setSearchParams } = useTodoSearchStore()

<input
  value={searchParams.q || ''}
  onChange={(e) => setSearchParams({ ...searchParams, q: e.target.value })}
/>
// 問題点:
// 1. 入力ごとに状態更新（パフォーマンス低下）
// 2. バリデーションロジックが分散
// 3. エラー状態の管理が複雑
// 4. 複数コンポーネントが同時に入力値を参照すると競合

// ✅ React Hook Form
const { register } = useForm()
<input {...register('q')} />
// メリット:
// 1. 非制御コンポーネント（高速）
// 2. バリデーションはZodで一元管理
// 3. エラー状態は自動管理
// 4. 送信時のみZustandに保存
```

**責務の分離**:

```
┌─────────────────────────────────────────────┐
│         フォーム入力（一時的な状態）           │
│                                              │
│  React Hook Form                             │
│  • 入力中の値                                 │
│  • バリデーション                              │
│  • エラー状態                                 │
│  • タッチ状態                                 │
└─────────────────┬───────────────────────────┘
                  │ onSubmit
                  │ バリデーション成功
                  ▼
┌─────────────────────────────────────────────┐
│       確定済みパラメータ（共有状態）           │
│                                              │
│  Zustand                                    │
│  • 検索パラメータ                             │
│  • 複数コンポーネントで参照                    │
│  • URL同期                                   │
│  • localStorage永続化                        │
└─────────────────────────────────────────────┘
```

**React Hook Formを使わない場合の問題**:

1. **パフォーマンス**: 入力ごとに全コンポーネントが再レンダリング
2. **バリデーション**: 手動で実装が必要、エラー処理が複雑
3. **DX**: フォーム状態管理のボイラープレートが増加
4. **型安全性**: Zodとの連携で自動的に型が生成される

**結論**:

Zustandは**グローバルなUI状態管理**、React Hook Formは**フォーム特化の状態管理**という明確な責務分離により、最適なアーキテクチャを実現。両者は競合ではなく**補完関係**にある。

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

## プロジェクト規模別の推奨

### 小規模プロジェクト（個人開発、MVP、スタートアップ初期）

**推奨**: Zustand または Context API

| 要件 | 推奨ライブラリ | 理由 |
|------|---------------|------|
| 状態が1-2個だけ | Context API | 外部依存なし、学習不要 |
| 状態が3個以上 | Zustand | ボイラープレート少、DevTools |
| 永続化が必要 | Zustand | ミドルウェア1行で実装可能 |

**例**: Todoアプリ、ブログ、ポートフォリオサイト

### 中規模プロジェクト（スタートアップ成長期、中小企業SaaS）

**推奨**: Zustand または Jotai

| 要件 | 推奨ライブラリ | 理由 |
|------|---------------|------|
| チーム3-10人 | Zustand | 学習コスト低、統一されたパターン |
| 状態が分散的 | Jotai | Atomベースで細かく管理 |
| Next.js App Router | Zustand | Providerなし、SSR対応 |

**例**: ECサイト、CRM、予約システム、マッチングアプリ

### 大規模プロジェクト（大企業基幹システム、エンタープライズ）

**推奨**: Redux Toolkit

| 要件 | 推奨ライブラリ | 理由 |
|------|---------------|------|
| チーム10+人 | Redux Toolkit | 統一されたパターン、厳格なルール |
| 複雑なビジネスロジック | Redux Toolkit + Saga | 複雑な非同期フロー、トランザクション管理 |
| 監査ログ必須 | Redux Toolkit | すべての操作がアクションとして記録 |
| 長期メンテナンス（5年+） | Redux Toolkit | 安定したAPI、豊富なドキュメント |
| レガシー統合 | Redux Toolkit | 既存Reduxコードベースとの互換性 |

**例**: 銀行システム、医療カルテシステム、ERPシステム、官公庁システム

### 大企業基幹システムでReduxが選ばれる理由

#### 1. 厳格なガバナンス

```tsx
// Redux: すべての状態変更がアクションを通過
// → コードレビューで操作を追跡可能
dispatch({ type: 'TRANSFER_FUNDS', payload: { from, to, amount } })

// Zustand: 自由度が高い（統制が難しい）
set({ balance: balance - amount }) // 直接変更
```

**大企業の課題**:
- 多数の開発者（50-200人）
- 新人とベテランの混在
- 外部委託ベンダーとの協業
- コード品質のばらつき

**Redux の利点**:
- 全員が同じパターンを強制される
- アクション = 操作の仕様書
- レビュー時に「何をしているか」が明確

#### 2. 監査要件への対応

```tsx
// Redux: ミドルウェアですべての操作を記録
const auditMiddleware = (store) => (next) => (action) => {
  const prevState = store.getState()
  const result = next(action)
  const nextState = store.getState()

  // 監査ログ送信
  auditLogger.log({
    timestamp: new Date().toISOString(),
    userId: prevState.auth.user.id,
    userName: prevState.auth.user.name,
    department: prevState.auth.user.department,
    action: action.type,
    payload: action.payload,
    prevState: sanitize(prevState),
    nextState: sanitize(nextState),
    ipAddress: getClientIP(),
    sessionId: getSessionId(),
  })

  return result
}
```

**対応可能な監査要件**:
- ✅ 誰が（ユーザーID、部署）
- ✅ いつ（タイムスタンプ）
- ✅ 何を（アクションタイプ）
- ✅ どう変更したか（変更前後の差分）
- ✅ どこから（IPアドレス、端末情報）

**必須となる業界**:
- 金融（銀行法、金融商品取引法）
- 医療（医療法、個人情報保護法）
- 官公庁（行政機関個人情報保護法）
- 上場企業（内部統制報告制度、J-SOX）

#### 3. 複雑なビジネスルールの管理

```tsx
// Redux Saga: 複雑な業務フローを管理
function* transferFundsSaga(action) {
  const { fromAccount, toAccount, amount } = action.payload

  try {
    // 1. 残高チェック
    const balance = yield call(api.getBalance, fromAccount)
    if (balance < amount) {
      throw new Error('残高不足')
    }

    // 2. 限度額チェック
    const dailyLimit = yield call(api.getDailyLimit, fromAccount)
    const todayTotal = yield select(selectTodayTransferTotal)
    if (todayTotal + amount > dailyLimit) {
      throw new Error('1日の限度額を超過')
    }

    // 3. マネーロンダリングチェック
    const isHighRisk = yield call(api.checkAML, { fromAccount, toAccount, amount })
    if (isHighRisk) {
      yield call(api.notifyCompliance, action.payload)
      throw new Error('コンプライアンス確認が必要')
    }

    // 4. トランザクション実行
    yield call(api.lockAccounts, [fromAccount, toAccount])
    yield call(api.debit, fromAccount, amount)
    yield call(api.credit, toAccount, amount)
    yield call(api.unlockAccounts, [fromAccount, toAccount])

    // 5. 通知送信
    yield fork(api.sendNotification, fromAccount)
    yield fork(api.sendNotification, toAccount)

    yield put({ type: 'TRANSFER_SUCCESS' })
  } catch (error) {
    yield put({ type: 'TRANSFER_FAILED', error })
    yield call(api.rollback)
  }
}
```

**Zustandでは困難**:
- 複雑な非同期フローの管理
- トランザクション制御
- エラー時のロールバック
- 並列処理の制御

#### 4. チーム間の調整コスト削減

**大企業の開発体制**:
```
チームA（フロントエンド）: 20人
チームB（バックエンド）: 30人
チームC（QA）: 15人
ベンダーD（保守）: 10人
計: 75人
```

**Reduxのメリット**:
- **統一されたパターン**: 誰が書いても同じコード
- **明確な仕様**: アクション = APIのような仕様書
- **引き継ぎやすい**: 新メンバーもすぐに理解可能

```tsx
// アクション定義 = チーム間の契約
export const UserActions = {
  UPDATE_PROFILE: 'USER/UPDATE_PROFILE',
  DELETE_ACCOUNT: 'USER/DELETE_ACCOUNT',
}

// チームAはアクションを見るだけで理解可能
dispatch({
  type: UserActions.UPDATE_PROFILE,
  payload: { userId: 123, name: 'Taro' }
})
```

#### 5. 長期メンテナンス（5-10年）

**基幹システムの寿命**: 5-10年（場合によっては20年以上）

**Reduxの優位性**:
| 項目 | Redux | Zustand |
|------|-------|---------|
| 初版リリース | 2015年 | 2019年 |
| 実績 | 10年 | 6年 |
| 破壊的変更 | ほぼなし | 少ない |
| ドキュメント | 非常に豊富 | 増加中 |
| 企業採用例 | Facebook, Netflix, Uber | 増加中 |

**長期運用での懸念**:
- ライブラリのメンテナンス停止リスク
- 破壊的変更による大規模改修
- 技術者の枯渇（採用難）

→ Reduxは10年の実績、Zustandは新しいが成長中

#### 6. セキュリティとアクセス制御

```tsx
// Redux: ミドルウェアで権限チェックを一元管理
const authMiddleware = (store) => (next) => (action) => {
  const user = store.getState().auth.user

  // 管理者専用操作のチェック
  if (action.type.startsWith('ADMIN/') && user.role !== 'admin') {
    console.error('権限エラー: 管理者のみ実行可能')
    return // アクションをブロック
  }

  // 部署制限のチェック
  if (action.type === 'VIEW_CONFIDENTIAL' && user.department !== 'legal') {
    console.error('権限エラー: 法務部のみ閲覧可能')
    return
  }

  return next(action)
}

// すべての操作が必ずこのミドルウェアを通過
// → 権限漏れのリスクが低い
```

#### 7. テスタビリティ

```tsx
// Redux: Reducerは純粋関数 → テストが簡単
describe('userReducer', () => {
  it('UPDATE_PROFILEアクションで名前を更新', () => {
    const prevState = { user: { id: 1, name: 'Taro' } }
    const action = { type: 'UPDATE_PROFILE', payload: { name: 'Hanako' } }
    const nextState = userReducer(prevState, action)

    expect(nextState.user.name).toBe('Hanako')
  })
})

// 数百のアクション × 数百のテストケースを自動化可能
```

### 規模別推奨まとめ

| プロジェクト規模 | 推奨 | バンドルサイズ | 学習コスト | ガバナンス | 監査対応 | コメント |
|-----------------|------|---------------|-----------|-----------|---------|---------|
| **小規模** (1-3人) | **Zustand** | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐ | Atom好みならJotai |
| **中規模** (3-10人) | **Zustand** | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ | Atom好みならJotai |
| **大規模** (10-50人) | **Redux** / Zustand | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | モダン志向ならJotai検討可 |
| **超大規模** (50+人) | **Redux** | ⭐ | ⭐ | ⭐⭐⭐ | ⭐⭐⭐ | 実績重視 |
| **基幹システム** | **Redux** > Jotai > Zustand | ⭐ | ⭐ | ⭐⭐⭐ | ⭐⭐⭐ | 監査・長期運用が最優先 |

### 基幹システムでJotaiという選択肢

近年、モダンな基幹システムではJotaiを採用する事例も増えている。

#### Jotaiが基幹システムで選ばれる理由

**1. 細かい状態管理とパフォーマンス**

```tsx
// Redux: すべての状態が1つのストア
const state = {
  users: { /* 10,000件 */ },
  orders: { /* 50,000件 */ },
  products: { /* 5,000件 */ },
}
// 1つの変更で関連する全コンポーネントが再評価のリスク

// Jotai: Atomごとに完全に独立
const userAtom = atom(user123) // この変更はこのAtomだけ
const orderAtom = atom(order456) // 他のAtomに影響なし
```

**2. React Suspenseとの統合**

```tsx
// Jotai: Suspenseネイティブサポート
const asyncUserAtom = atom(async (get) => {
  const userId = get(userIdAtom)
  return await fetchUser(userId)
})

function UserProfile() {
  const user = useAtomValue(asyncUserAtom)
  // Suspenseで自動的にローディング管理
  return <div>{user.name}</div>
}

// Suspense境界で一括管理
<Suspense fallback={<Loading />}>
  <UserProfile />
  <UserOrders />
</Suspense>
```

**3. TypeScript型推論の強力さ**

```tsx
// Jotai: Atomから自動的に型推論
const countAtom = atom(0)
const doubleAtom = atom((get) => get(countAtom) * 2)
// doubleAtomの型は自動的にnumberと推論される

// Redux: 手動で型定義が必要
type RootState = {
  count: number
  double: number
}
```

**4. テスタビリティ**

```tsx
// Jotai: Atomは純粋な値、テストが容易
import { atom } from 'jotai'

const countAtom = atom(0)
const incrementAtom = atom(
  (get) => get(countAtom),
  (get, set) => set(countAtom, get(countAtom) + 1)
)

// テスト
import { createStore } from 'jotai'

describe('incrementAtom', () => {
  it('カウントを1増やす', () => {
    const store = createStore()
    store.set(countAtom, 5)
    store.set(incrementAtom)
    expect(store.get(countAtom)).toBe(6)
  })
})
```

**5. 段階的な移行が可能**

```tsx
// ReduxとJotaiを併用できる
import { useSelector } from 'react-redux'
import { useAtom } from 'jotai'

function HybridComponent() {
  // レガシーはRedux
  const legacyData = useSelector((state) => state.legacy)

  // 新機能はJotai
  const [newFeature, setNewFeature] = useAtom(newFeatureAtom)
}
```

#### 基幹システムでのJotai採用事例

**事例1: 大手SaaS企業（従業員1000人規模）**

- **Before (Redux)**:
  - 巨大な単一ストア（50,000行）
  - パフォーマンス問題（不要な再レンダリング）
  - 新機能追加が困難

- **After (Jotai)**:
  - Atomごとに独立した状態管理
  - パフォーマンス50%改善
  - 開発速度2倍

**事例2: 医療システム（患者データ管理）**

```tsx
// 患者ごとにAtomを動的生成
const patientFamily = atomFamily((patientId: string) =>
  atom(async () => {
    return await fetchPatient(patientId)
  })
)

// 10,000人の患者データも効率的に管理
function PatientCard({ patientId }) {
  const patient = useAtomValue(patientFamily(patientId))
  // 必要な患者データだけロード、他に影響なし
}
```

#### 基幹システムでのAtom設計パターン

基幹システムでは**CRUD操作単位でAtomを分離**するのが一般的。

**パターン1: データとCRUD操作を分離（推奨）**

```tsx
// ========================================
// データAtom（読み取り専用）
// ========================================
const usersAtom = atom<User[]>([])

// ========================================
// CRUD操作Atom（書き込み専用）
// ========================================

// Create
const createUserAtom = atom(
  null, // 読み取り不可
  async (get, set, newUser: CreateUserInput) => {
    // 1. APIコール
    const createdUser = await api.createUser(newUser)

    // 2. 監査ログ
    auditLogger.log('CREATE_USER', null, createdUser)

    // 3. ローカル状態更新
    const currentUsers = get(usersAtom)
    set(usersAtom, [...currentUsers, createdUser])

    // 4. 関連状態の更新
    set(userCountAtom, (count) => count + 1)

    return createdUser
  }
)

// Read（詳細取得）
const fetchUserAtom = atom(
  null,
  async (get, set, userId: string) => {
    const user = await api.getUser(userId)

    // キャッシュに追加
    const currentUsers = get(usersAtom)
    const index = currentUsers.findIndex((u) => u.id === userId)
    if (index !== -1) {
      const newUsers = [...currentUsers]
      newUsers[index] = user
      set(usersAtom, newUsers)
    }

    return user
  }
)

// Update
const updateUserAtom = atom(
  null,
  async (get, set, { id, data }: { id: string; data: UpdateUserInput }) => {
    const currentUsers = get(usersAtom)
    const prevUser = currentUsers.find((u) => u.id === id)

    // APIコール
    const updatedUser = await api.updateUser(id, data)

    // 監査ログ
    auditLogger.log('UPDATE_USER', prevUser, updatedUser)

    // 状態更新
    set(
      usersAtom,
      currentUsers.map((u) => (u.id === id ? updatedUser : u))
    )

    return updatedUser
  }
)

// Delete
const deleteUserAtom = atom(
  null,
  async (get, set, userId: string) => {
    const currentUsers = get(usersAtom)
    const deletedUser = currentUsers.find((u) => u.id === userId)

    // APIコール
    await api.deleteUser(userId)

    // 監査ログ
    auditLogger.log('DELETE_USER', deletedUser, null)

    // 状態更新
    set(
      usersAtom,
      currentUsers.filter((u) => u.id !== userId)
    )
    set(userCountAtom, (count) => count - 1)
  }
)

// ========================================
// 使用例
// ========================================
function UserManagement() {
  const users = useAtomValue(usersAtom)
  const [, createUser] = useAtom(createUserAtom)
  const [, updateUser] = useAtom(updateUserAtom)
  const [, deleteUser] = useAtom(deleteUserAtom)

  const handleCreate = async (data: CreateUserInput) => {
    const newUser = await createUser(data)
    toast.success(`${newUser.name}を作成しました`)
  }

  const handleUpdate = async (id: string, data: UpdateUserInput) => {
    await updateUser({ id, data })
    toast.success('更新しました')
  }

  const handleDelete = async (id: string) => {
    await deleteUser(id)
    toast.success('削除しました')
  }

  return (
    <div>
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          onUpdate={(data) => handleUpdate(user.id, data)}
          onDelete={() => handleDelete(user.id)}
        />
      ))}
      <CreateUserButton onCreate={handleCreate} />
    </div>
  )
}
```

**パターン2: atomFamilyでリソース単位に分離（大規模向け）**

```tsx
// ========================================
// リソースごとにAtomFamily（10,000件以上のデータ）
// ========================================
const userFamily = atomFamily((userId: string) =>
  atom<User | null>(null)
)

// CRUD操作もリソース単位
const updateUserFamily = atomFamily((userId: string) =>
  atom(
    null,
    async (get, set, data: UpdateUserInput) => {
      const userAtom = userFamily(userId)
      const prevUser = get(userAtom)

      const updatedUser = await api.updateUser(userId, data)

      auditLogger.log('UPDATE_USER', prevUser, updatedUser)

      set(userAtom, updatedUser)

      return updatedUser
    }
  )
)

// 使用例（10,000人分のデータでも高速）
function UserDetail({ userId }: { userId: string }) {
  const user = useAtomValue(userFamily(userId))
  const [, updateUser] = useAtom(updateUserFamily(userId))
  // 他のユーザーの変更に影響されない
}
```

**パターン3: トランザクション管理（金融・決済システム）**

```tsx
// ========================================
// トランザクションAtom
// ========================================
const transferFundsAtom = atom(
  null,
  async (get, set, { from, to, amount }: TransferInput) => {
    // 1. 残高Atomを取得
    const fromAccountAtom = accountFamily(from)
    const toAccountAtom = accountFamily(to)

    const fromAccount = get(fromAccountAtom)
    const toAccount = get(toAccountAtom)

    // 2. バリデーション
    if (fromAccount.balance < amount) {
      throw new Error('残高不足')
    }

    // 3. 楽観的更新（UI即座に反映）
    set(fromAccountAtom, {
      ...fromAccount,
      balance: fromAccount.balance - amount,
    })
    set(toAccountAtom, {
      ...toAccount,
      balance: toAccount.balance + amount,
    })

    try {
      // 4. APIコール（トランザクション）
      const result = await api.transferFunds({ from, to, amount })

      // 5. 監査ログ
      auditLogger.log('TRANSFER_FUNDS', {
        from: fromAccount,
        to: toAccount,
        amount,
        result,
      })

      // 6. 確定データで上書き
      set(fromAccountAtom, result.fromAccount)
      set(toAccountAtom, result.toAccount)

      return result
    } catch (error) {
      // 7. エラー時はロールバック
      set(fromAccountAtom, fromAccount)
      set(toAccountAtom, toAccount)

      auditLogger.error('TRANSFER_FAILED', { from, to, amount, error })

      throw error
    }
  }
)

// 使用例
function TransferForm() {
  const [, transfer] = useAtom(transferFundsAtom)

  const handleSubmit = async (data: TransferInput) => {
    try {
      await transfer(data)
      toast.success('送金完了')
    } catch (error) {
      toast.error(error.message)
    }
  }
}
```

**パターン4: 複数操作の連鎖（在庫管理システム）**

```tsx
// ========================================
// 複数CRUD操作を組み合わせる
// ========================================
const processOrderAtom = atom(
  null,
  async (get, set, order: Order) => {
    // 1. 在庫チェック・減算
    for (const item of order.items) {
      const stockAtom = stockFamily(item.productId)
      const stock = get(stockAtom)

      if (stock.quantity < item.quantity) {
        throw new Error(`在庫不足: ${item.productName}`)
      }

      // 在庫減算
      set(stockAtom, {
        ...stock,
        quantity: stock.quantity - item.quantity,
      })
    }

    // 2. 注文作成
    const [, createOrder] = get(createOrderAtom)
    const createdOrder = await createOrder(order)

    // 3. 請求書生成
    const [, createInvoice] = get(createInvoiceAtom)
    await createInvoice(createdOrder.id)

    // 4. メール送信（非同期）
    set(sendOrderConfirmationAtom, createdOrder)

    // 5. 監査ログ
    auditLogger.log('PROCESS_ORDER', null, {
      order: createdOrder,
      stockUpdates: order.items,
    })

    return createdOrder
  }
)
```

#### CRUD単位でAtomを分離するメリット

| メリット | 説明 |
|---------|------|
| **責務の明確化** | Create/Update/Deleteの処理が独立、変更が容易 |
| **監査ログの一元管理** | 各CRUD Atomで自動的にログ記録 |
| **権限チェック** | Atom単位で権限を確認可能 |
| **テスト容易性** | CRUD操作ごとに独立してテスト可能 |
| **楽観的更新** | UI即座反映、エラー時ロールバック |
| **型安全性** | 操作ごとに引数・戻り値の型が明確 |

#### ReduxとJotaiのCRUD設計比較

**重要**: Reduxは**リソース（ドメイン）ごとにReducerを分割**し、最終的に1つのStoreに統合する。

```tsx
// ========================================
// Redux Toolkit: リソースごとにSlice（Reducer）を分割
// ========================================

// ============ users/userSlice.ts ============
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// 非同期アクション（CRUD操作）
export const createUser = createAsyncThunk(
  'users/create',
  async (data: CreateUserInput, { rejectWithValue }) => {
    try {
      const user = await api.createUser(data)
      auditLogger.log('CREATE_USER', null, user)
      return user
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const updateUser = createAsyncThunk(
  'users/update',
  async ({ id, data }: { id: string; data: UpdateUserInput }) => {
    const user = await api.updateUser(id, data)
    auditLogger.log('UPDATE_USER', null, user)
    return user
  }
)

export const deleteUser = createAsyncThunk(
  'users/delete',
  async (id: string) => {
    await api.deleteUser(id)
    auditLogger.log('DELETE_USER', id, null)
    return id
  }
)

// Slice（リソース単位のReducer + Actions）
const userSlice = createSlice({
  name: 'users',
  initialState: {
    list: [] as User[],
    loading: false,
    error: null,
  },
  reducers: {
    // 同期アクション（必要に応じて）
    clearUsers: (state) => {
      state.list = []
    },
  },
  extraReducers: (builder) => {
    // Create
    builder.addCase(createUser.fulfilled, (state, action) => {
      state.list.push(action.payload)
    })
    // Update
    builder.addCase(updateUser.fulfilled, (state, action) => {
      const index = state.list.findIndex((u) => u.id === action.payload.id)
      if (index !== -1) {
        state.list[index] = action.payload
      }
    })
    // Delete
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.list = state.list.filter((u) => u.id !== action.payload)
    })
  },
})

export default userSlice.reducer

// ============ orders/orderSlice.ts ============
const orderSlice = createSlice({
  name: 'orders',
  initialState: { list: [] as Order[] },
  reducers: { /* ... */ },
  extraReducers: (builder) => { /* CRUD処理 */ },
})

export default orderSlice.reducer

// ============ products/productSlice.ts ============
const productSlice = createSlice({
  name: 'products',
  initialState: { list: [] as Product[] },
  reducers: { /* ... */ },
  extraReducers: (builder) => { /* CRUD処理 */ },
})

export default productSlice.reducer

// ========================================
// store.ts: すべてのSliceを1つのStoreに統合
// ========================================
import { configureStore } from '@reduxjs/toolkit'
import userReducer from './users/userSlice'
import orderReducer from './orders/orderSlice'
import productReducer from './products/productSlice'

export const store = configureStore({
  reducer: {
    users: userReducer,      // usersドメイン
    orders: orderReducer,    // ordersドメイン
    products: productReducer, // productsドメイン
  },
})

// グローバル型定義
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// ========================================
// 使用側
// ========================================
import { useDispatch, useSelector } from 'react-redux'
import { createUser, updateUser, deleteUser } from './users/userSlice'

function UserManagement() {
  const dispatch = useDispatch<AppDispatch>()
  const users = useSelector((state: RootState) => state.users.list)

  const handleCreate = (data: CreateUserInput) => {
    dispatch(createUser(data))
  }

  const handleUpdate = (id: string, data: UpdateUserInput) => {
    dispatch(updateUser({ id, data }))
  }

  const handleDelete = (id: string) => {
    dispatch(deleteUser(id))
  }
}

// ========================================
// Jotai: リソースごとにAtomを定義（統合不要）
// ========================================

// ============ users/atoms.ts ============
const usersAtom = atom<User[]>([])
const createUserAtom = atom(null, async (get, set, data: CreateUserInput) => {
  const user = await api.createUser(data)
  set(usersAtom, [...get(usersAtom), user])
})
const updateUserAtom = atom(null, async (get, set, { id, data }) => { /* ... */ })
const deleteUserAtom = atom(null, async (get, set, id) => { /* ... */ })

// ============ orders/atoms.ts ============
const ordersAtom = atom<Order[]>([])
const createOrderAtom = atom(null, async (get, set, data) => { /* ... */ })

// ============ products/atoms.ts ============
const productsAtom = atom<Product[]>([])
const createProductAtom = atom(null, async (get, set, data) => { /* ... */ })

// ========================================
// 使用側（統合不要、直接import）
// ========================================
import { usersAtom, createUserAtom } from './users/atoms'

function UserManagement() {
  const users = useAtomValue(usersAtom)
  const [, createUser] = useAtom(createUserAtom)

  const handleCreate = async (data: CreateUserInput) => {
    await createUser(data)
  }
}
```

**Reduxの構造（アプリケーション全体）**:

```
Redux Store（アプリケーション全体で1つ）
├── users: userReducer       ← usersドメインのSlice
│   ├── list: User[]
│   ├── loading: boolean
│   └── error: string | null
├── orders: orderReducer     ← ordersドメインのSlice
│   ├── list: Order[]
│   └── currentOrder: Order | null
├── products: productReducer ← productsドメインのSlice
│   ├── list: Product[]
│   └── selectedProduct: Product | null
└── ui: uiReducer           ← UI状態のSlice
    ├── sidebarOpen: boolean
    └── theme: 'light' | 'dark'
```

**Jotaiの構造（分散型）**:

```
Atoms（分散、統合不要）
├── users/
│   ├── usersAtom (User[])
│   ├── createUserAtom
│   ├── updateUserAtom
│   └── deleteUserAtom
├── orders/
│   ├── ordersAtom (Order[])
│   ├── createOrderAtom
│   └── updateOrderAtom
├── products/
│   ├── productsAtom (Product[])
│   └── createProductAtom
└── ui/
    ├── sidebarOpenAtom (boolean)
    └── themeAtom ('light' | 'dark')
```

**比較**:

| 観点 | Redux | Jotai |
|------|-------|-------|
| **ドメイン分割** | ✅ Slice単位で分割 | ✅ Atomファイル単位で分割 |
| **統合** | ⚠️ configureStoreで統合必須 | ✅ 統合不要、直接import |
| **グローバル型** | ⚠️ RootState手動定義 | ✅ 各Atomで型推論 |
| **ボイラープレート** | ⚠️ Slice定義、extraReducers | ✅ Atom定義のみ |
| **CRUD分離** | ✅ createAsyncThunk | ✅ 書き込み専用Atom |
| **監査ログ** | ✅ ミドルウェアで一元管理 | ⚠️ 各Atomに実装 |
| **複雑な操作** | ✅ Saga/Thunkで管理 | ✅ Atom内で完結 |
| **状態の見通し** | ✅ 1つのStoreで全体把握 | ⚠️ Atomが分散、把握しづらい |

**Reduxの利点**:

1. **単一のストア**: `RootState`を見れば全体の状態構造が一目瞭然
2. **厳格な型定義**: アプリケーション全体の型が一箇所に集約
3. **監査ログ**: ミドルウェアですべてのアクションを自動記録
4. **DevTools**: タイムトラベルで全ドメインの状態を時系列で追跡

**Jotaiの利点**:

1. **統合不要**: 各ドメインが完全に独立、相互依存なし
2. **軽量**: ドメインごとに必要なAtomだけimport
3. **型推論**: グローバル型定義不要、Atomごとに自動推論
4. **柔軟性**: 新しいドメイン追加時にStoreの再設定不要

**基幹システムでの選択**:

| ケース | 推奨 | 理由 |
|--------|------|------|
| **全体の状態把握が重要** | Redux | RootStateで全体構造が明確 |
| **監査ログが必須** | Redux | ミドルウェアで一元管理 |
| **ドメインが独立** | Jotai | 統合不要、各ドメインで完結 |
| **段階的な開発** | Jotai | 新ドメイン追加が容易 |
| **チーム統制が必要** | Redux | 厳格なパターン強制 |

#### 基幹システムでの推奨設計

**小規模リソース（100件未満）**:
```tsx
const usersAtom = atom<User[]>([])
const createUserAtom = atom(null, async (get, set, data) => { /* ... */ })
```

**大規模リソース（1,000件以上）**:
```tsx
const userFamily = atomFamily((id: string) => atom<User | null>(null))
const updateUserFamily = atomFamily((id: string) => atom(null, async () => { /* ... */ }))
```

**複雑なトランザクション**:
```tsx
const transferFundsAtom = atom(null, async (get, set, data) => {
  // 複数Atomを更新、ロールバック処理も含む
})
```

#### JotaiとReduxの比較（基幹システム視点）

| 項目 | Redux | Jotai | 評価 |
|------|-------|-------|------|
| **監査ログ** | ⭐⭐⭐ ミドルウェアで一元管理 | ⭐⭐ 手動実装が必要 | Reduxが有利 |
| **パフォーマンス** | ⭐⭐ 大規模化で課題 | ⭐⭐⭐ Atomで最適化 | Jotaiが有利 |
| **学習コスト** | ⭐ 高い（7概念） | ⭐⭐ 中程度（4概念） | Jotaiが有利 |
| **長期実績** | ⭐⭐⭐ 10年 | ⭐⭐ 4年 | Reduxが有利 |
| **React最新機能** | ⭐⭐ 対応中 | ⭐⭐⭐ ネイティブ対応 | Jotaiが有利 |
| **チーム統制** | ⭐⭐⭐ 厳格なパターン | ⭐⭐ 自由度高い | Reduxが有利 |
| **コード量** | ⭐ 多い（80行） | ⭐⭐⭐ 少ない（30行） | Jotaiが有利 |

#### 基幹システムでの推奨順位

```
1位: Redux Toolkit
   ✅ 監査ログ、チーム統制、10年の実績
   ⚠️ ボイラープレート、学習コスト

2位: Jotai
   ✅ パフォーマンス、モダン、コード量少
   ⚠️ 監査ログ要手動実装、実績4年

3位: Zustand
   ✅ シンプル、学習コスト低
   ⚠️ 大規模には不向き、監査ログ難
```

#### Jotai採用の判断基準

**Jotaiを選ぶべきケース**:
- ✅ React最新機能（Suspense, Concurrent）を積極活用
- ✅ パフォーマンスが最重要課題
- ✅ モダンな開発体験を重視
- ✅ チームのReactスキルが高い
- ✅ 監査ログを自前で実装できる

**Reduxを選ぶべきケース**:
- ✅ 金融・医療など厳格な監査が必須
- ✅ 10年以上の長期運用
- ✅ 新人が多く、統制が必要
- ✅ レガシーReduxコードとの統合
- ✅ 複雑なトランザクション管理（Saga）

#### 実装例: Jotaiでの監査ログ

```tsx
// Jotaiでも監査ログは実装可能（やや手間）
import { atom } from 'jotai'

const auditLogger = {
  log: (action: string, prevValue: any, nextValue: any) => {
    fetch('/api/audit-logs', {
      method: 'POST',
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        action,
        prevValue,
        nextValue,
      }),
    })
  },
}

// 監査対象のAtom
const balanceAtom = atom(10000)

// 更新用Atomに監査ログを組み込む
const updateBalanceAtom = atom(
  null,
  (get, set, newBalance: number) => {
    const prevBalance = get(balanceAtom)

    // 監査ログ記録
    auditLogger.log('UPDATE_BALANCE', prevBalance, newBalance)

    // 状態更新
    set(balanceAtom, newBalance)
  }
)

// 使用側
function TransferForm() {
  const [, updateBalance] = useAtom(updateBalanceAtom)

  const handleTransfer = (amount: number) => {
    updateBalance(amount) // 自動的に監査ログ記録
  }
}
```

**問題点**:
- すべてのAtomに手動で監査ログを組み込む必要
- Reduxのミドルウェアのような一元管理が難しい

**解決策**:
```tsx
// カスタムフックで一元管理
function useAuditedAtom<T>(
  baseAtom: WritableAtom<T, any, any>,
  actionName: string
) {
  const [value, setValue] = useAtom(baseAtom)

  const auditedSetValue = (newValue: T) => {
    auditLogger.log(actionName, value, newValue)
    setValue(newValue)
  }

  return [value, auditedSetValue] as const
}

// 使用側
const [balance, setBalance] = useAuditedAtom(balanceAtom, 'UPDATE_BALANCE')
```

### 本プロジェクトの位置づけ

**本プロジェクト**: 小規模Todoアプリ（学習目的）
- チーム規模: 1人
- 状態: 検索パラメータ、モーダル開閉
- 監査要件: なし
- 運用期間: 短期

**結論**: Zustandが最適

もし将来的に以下の要件が追加される場合の移行先:
- **大規模化（チーム10人以上）** → Redux Toolkit
- **監査ログ必須（金融・医療）** → Redux Toolkit
- **複雑な業務フロー（Saga必要）** → Redux Toolkit
- **モダン志向・パフォーマンス重視** → Jotai
- **React最新機能を積極活用** → Jotai

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
- 2025-11-08: Redux Toolkitの評価を詳細に追加、React Hook Formとの責務分離を追加
- 2025-11-08: 全ライブラリ比較表、Context API詳細評価、Recoil/Jotai詳細評価、プロジェクト規模別推奨を追加
