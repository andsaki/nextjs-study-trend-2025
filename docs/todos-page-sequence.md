# Todosページのシーケンス図

## 1. 初期ロード時の流れ

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant TodosPage
    participant useSearchParams
    participant ZustandStore
    participant TanStackQuery
    participant API

    User->>Browser: /todosにアクセス
    Browser->>TodosPage: ページレンダリング開始

    TodosPage->>useSearchParams: URLパラメータ取得
    useSearchParams-->>TodosPage: searchParamsFromUrl

    TodosPage->>ZustandStore: useTodoSearchStore()
    ZustandStore-->>TodosPage: {searchParams, showSearch, ...}

    Note over TodosPage: useEffect実行
    TodosPage->>TodosPage: URLパラメータをパース<br/>(q, completed, priority, sortBy, sortOrder)
    TodosPage->>ZustandStore: setSearchParams(params)
    ZustandStore->>ZustandStore: stateを更新

    alt URLパラメータが存在
        TodosPage->>ZustandStore: setShowSearch(true)
        ZustandStore->>ZustandStore: showSearch = true
    end

    TodosPage->>TanStackQuery: useTodos(searchParams)
    TanStackQuery->>API: GET /api/todos?q=...&completed=...
    API-->>TanStackQuery: todos[]
    TanStackQuery-->>TodosPage: {data: todos, isLoading, error}

    TodosPage->>Browser: UIレンダリング
    Browser-->>User: Todo一覧を表示
```

## 2. 検索実行時の流れ

```mermaid
sequenceDiagram
    actor User
    participant SearchForm
    participant TodosPage
    participant ZustandStore
    participant Router
    participant TanStackQuery
    participant API

    User->>SearchForm: 検索条件を入力
    User->>SearchForm: 「検索」ボタンクリック

    SearchForm->>SearchForm: handleSubmit実行
    SearchForm->>SearchForm: 空の値を除外
    SearchForm->>TodosPage: onSearch(filteredParams)

    TodosPage->>TodosPage: handleSearch実行
    TodosPage->>ZustandStore: setSearchParams(params)
    ZustandStore->>ZustandStore: searchParamsを更新
    ZustandStore->>localStorage: 状態を永続化

    TodosPage->>Router: router.push(/todos?q=...&priority=...)
    Router->>Router: URLを更新

    Note over TodosPage: URLパラメータ変更により<br/>useEffectが再実行
    TodosPage->>TanStackQuery: useTodos(新しいsearchParams)

    TanStackQuery->>TanStackQuery: queryKeyが変化を検知
    TanStackQuery->>API: GET /api/todos?q=...&priority=...
    API-->>TanStackQuery: フィルタされたtodos[]
    TanStackQuery-->>TodosPage: {data: todos, isLoading, error}

    TodosPage->>SearchForm: 再レンダリング
    SearchForm-->>User: 検索結果を表示
```

## 3. Todo完了トグル時の流れ

```mermaid
sequenceDiagram
    actor User
    participant TodoList
    participant TodosPage
    participant TanStackQuery
    participant API
    participant ZustandStore

    User->>TodoList: チェックボックスをクリック
    TodoList->>TodosPage: onToggleComplete(id, !completed)

    TodosPage->>TodosPage: handleToggleComplete実行
    TodosPage->>TanStackQuery: updateMutation.mutate({id, data: {completed}})

    TanStackQuery->>TanStackQuery: onMutate (楽観的更新)
    TanStackQuery->>TodoList: UIを即座に更新

    TanStackQuery->>API: PATCH /api/todos/:id<br/>{completed: true/false}
    API-->>TanStackQuery: 更新されたtodo

    TanStackQuery->>TanStackQuery: onSuccess
    TanStackQuery->>TanStackQuery: クエリキャッシュを無効化
    TanStackQuery->>API: GET /api/todos (再フェッチ)
    API-->>TanStackQuery: 最新のtodos[]

    TanStackQuery-->>TodosPage: {data: todos}
    TodosPage->>TodoList: 再レンダリング
    TodoList-->>User: 最新の状態を表示
```

## 4. Todo削除時の流れ

```mermaid
sequenceDiagram
    actor User
    participant TodoList
    participant TodosPage
    participant TanStackQuery
    participant API

    User->>TodoList: 「削除」ボタンクリック
    TodoList->>TodoList: handleDelete実行
    TodoList->>Browser: confirm("このTodoを削除しますか？")
    Browser-->>User: 確認ダイアログ表示
    User-->>Browser: OK

    TodoList->>TodoList: setDeletingId(id)
    TodoList->>TodosPage: onDelete(id)

    TodosPage->>TodosPage: handleDelete実行
    TodosPage->>TanStackQuery: deleteMutation.mutate(id)

    TanStackQuery->>API: DELETE /api/todos/:id
    API->>Database: DELETE FROM todos WHERE id = ?
    Database-->>API: 削除成功
    API-->>TanStackQuery: 204 No Content

    TanStackQuery->>TanStackQuery: onSuccess
    TanStackQuery->>TanStackQuery: クエリキャッシュを無効化
    TanStackQuery->>API: GET /api/todos (再フェッチ)
    API-->>TanStackQuery: 最新のtodos[]

    TanStackQuery-->>TodosPage: {data: todos}
    TodosPage->>TodoList: 再レンダリング
    TodoList->>TodoList: setDeletingId(null)
    TodoList-->>User: Todo削除後の一覧を表示
```

## 5. 検索フォーム表示/非表示トグル時の流れ

```mermaid
sequenceDiagram
    actor User
    participant Button
    participant TodosPage
    participant ZustandStore

    User->>Button: 「検索」ボタンクリック
    Button->>TodosPage: onClick()
    TodosPage->>ZustandStore: toggleShowSearch()

    ZustandStore->>ZustandStore: showSearch = !showSearch
    ZustandStore->>localStorage: showSearchを永続化
    ZustandStore-->>TodosPage: 状態更新通知

    TodosPage->>TodosPage: 再レンダリング

    alt showSearch === true
        TodosPage->>Browser: SearchFormを表示
    else showSearch === false
        TodosPage->>Browser: SearchFormを非表示
    end

    Browser-->>User: UI更新
```

## データフローの概要

```
┌─────────────────────────────────────────────────────────────┐
│                         TodosPage                            │
│                                                               │
│  ┌──────────────┐         ┌──────────────┐                  │
│  │  URL Params  │────────▶│   Zustand    │                  │
│  │ (useSearch   │         │    Store     │                  │
│  │   Params)    │         │              │                  │
│  └──────────────┘         └──────┬───────┘                  │
│         │                        │                           │
│         │                        ▼                           │
│         │              ┌──────────────────┐                  │
│         └─────────────▶│  searchParams    │                  │
│                        │   (state)        │                  │
│                        └────────┬─────────┘                  │
│                                 │                            │
│                                 ▼                            │
│                        ┌──────────────────┐                  │
│                        │  TanStack Query  │                  │
│                        │   useTodos()     │                  │
│                        └────────┬─────────┘                  │
│                                 │                            │
│                                 ▼                            │
│                        ┌──────────────────┐                  │
│                        │   API Endpoint   │                  │
│                        │  /api/todos      │                  │
│                        └────────┬─────────┘                  │
│                                 │                            │
│                                 ▼                            │
│                        ┌──────────────────┐                  │
│                        │    Database      │                  │
│                        │   (JSON File)    │                  │
│                        └──────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

## 状態管理の役割分担

| 技術 | 役割 | 例 |
|------|------|-----|
| **Zustand** | クライアント側のUI状態管理 | `searchParams`, `showSearch` |
| **TanStack Query** | サーバー状態管理（キャッシュ、同期） | `todos[]`, `isLoading`, `error` |
| **URL Params** | 共有可能な状態、ブラウザ履歴 | `/todos?q=test&priority=high` |
| **localStorage** | 永続化されたUI状態 | `showSearch`の保存 |

## キーポイント

1. **Zustand**: UI状態（検索パラメータ、検索フォーム表示）をグローバル管理
2. **TanStack Query**: サーバーデータの取得・キャッシュ・同期を自動化
3. **URL同期**: 検索条件をURLに反映し、リロードやシェア可能に
4. **楽観的更新**: UI即座更新→API呼び出し→確認の順で実行
5. **自動再フェッチ**: mutationが成功したらクエリを自動的に再取得
