# ADR 006: データベースORM選定 - Drizzle vs Prisma

## ステータス

提案中 (Proposed)

## コンテキスト

Next.jsアプリケーションにおいて、データベースアクセスとスキーマ管理を行うORMを選定する必要がある。現在Prismaを使用しているが、Drizzle ORMという新しい選択肢が登場している。

### 現状

- **現在使用中**: Prisma 6.19.0
- **package.json**: `@prisma/client`, `prisma` (dev)
- **シードスクリプト**: `db:seed` が設定済み

### アプリケーション要件

1. **型安全性**: TypeScriptとの完全な統合
2. **パフォーマンス**: クエリの効率性、バンドルサイズ
3. **開発体験**: スキーマ定義、マイグレーション、デバッグ
4. **学習コスト**: チーム全体での習得難易度
5. **エコシステム**: コミュニティ、ドキュメント、サポート

## 比較分析

### 1. アーキテクチャとアプローチ

#### Prisma

```prisma
// schema.prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])
}
```

**特徴**:
- 独自のスキーマ言語 (Prisma Schema Language)
- コード生成アプローチ (`prisma generate`)
- 抽象化レベルが高い
- Prisma Engineを使用（Rustで実装）

#### Drizzle ORM

```typescript
// schema.ts
import { pgTable, serial, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content'),
  published: boolean('published').default(false),
  authorId: integer('author_id').notNull().references(() => users.id),
})
```

**特徴**:
- TypeScriptベースのスキーマ定義
- SQL-likeなクエリビルダー
- 軽量（追加のエンジン不要）
- 直感的なAPI設計

### 2. クエリ構文比較

#### Prisma

```typescript
// データ取得
const users = await prisma.user.findMany({
  where: {
    email: { contains: '@example.com' },
    posts: { some: { published: true } },
  },
  include: {
    posts: {
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    },
  },
})

// データ作成
const user = await prisma.user.create({
  data: {
    email: 'test@example.com',
    name: 'Test User',
    posts: {
      create: [
        { title: 'First Post', content: 'Hello World' },
      ],
    },
  },
})

// トランザクション
await prisma.$transaction([
  prisma.user.create({ data: { email: 'user1@example.com' } }),
  prisma.user.create({ data: { email: 'user2@example.com' } }),
])
```

#### Drizzle ORM

```typescript
import { db } from './db'
import { users, posts } from './schema'
import { eq, like, and, desc } from 'drizzle-orm'

// データ取得
const usersWithPosts = await db.query.users.findMany({
  where: like(users.email, '%@example.com'),
  with: {
    posts: {
      where: eq(posts.published, true),
      orderBy: [desc(posts.createdAt)],
    },
  },
})

// データ作成
const [user] = await db.insert(users).values({
  email: 'test@example.com',
  name: 'Test User',
}).returning()

// トランザクション
await db.transaction(async (tx) => {
  await tx.insert(users).values({ email: 'user1@example.com' })
  await tx.insert(users).values({ email: 'user2@example.com' })
})
```

### 3. パフォーマンス比較

| 指標 | Prisma | Drizzle ORM | 備考 |
|------|--------|-------------|------|
| バンドルサイズ | ~30KB + Engine | ~5-8KB | Drizzleが大幅に軽量 |
| クエリ生成 | Prisma Engine経由 | 直接SQL生成 | Drizzleの方が高速 |
| コールドスタート | やや遅い | 高速 | サーバーレス環境で顕著 |
| 実行時オーバーヘッド | 中程度 | 最小限 | Drizzleはほぼゼロオーバーヘッド |
| 型チェック | ビルド時 | ビルド時 | 両方とも完全な型安全性 |

**ベンチマーク例** (参考値):
```
Simple SELECT Query:
- Prisma: ~2.5ms
- Drizzle: ~0.8ms
- Raw SQL: ~0.5ms

Cold Start (AWS Lambda):
- Prisma: ~800ms
- Drizzle: ~200ms
```

### 4. マイグレーション管理

#### Prisma

```bash
# マイグレーション作成
npx prisma migrate dev --name add_user_table

# 本番適用
npx prisma migrate deploy

# リセット
npx prisma migrate reset
```

**特徴**:
- 自動マイグレーション生成
- スキーマドリフト検出
- マイグレーション履歴の自動管理
- GUI (Prisma Studio) で視覚的に確認可能

#### Drizzle ORM

```bash
# マイグレーション生成
npx drizzle-kit generate:pg

# 適用
npx drizzle-kit push:pg

# Drizzle Studio
npx drizzle-kit studio
```

**特徴**:
- スキーマから自動生成
- SQLマイグレーションファイルが生成される
- 手動編集が可能（柔軟性高い）
- より直接的なSQL制御

### 5. 開発体験 (DX)

#### Prisma

**長所**:
- ✅ Prisma Studio（GUIデータブラウザ）
- ✅ 優れたVSCode拡張機能
- ✅ 自動補完・型推論が強力
- ✅ エラーメッセージが分かりやすい
- ✅ ドキュメントが充実

**短所**:
- ❌ コード生成のステップが必要（`prisma generate`）
- ❌ スキーマ言語の学習が必要
- ❌ カスタマイズに制限がある
- ❌ Prisma Engineの起動が必要

#### Drizzle ORM

**長所**:
- ✅ TypeScriptネイティブ（追加言語不要）
- ✅ SQLに近い感覚で書ける
- ✅ コード生成不要
- ✅ 軽量・高速
- ✅ 生成されるSQLが可読性高い

**短所**:
- ❌ エコシステムがまだ小さい
- ❌ ドキュメントがPrismaより少ない
- ❌ ツールサポートが発展途上
- ❌ リレーション定義がやや複雑

### 6. エコシステムとコミュニティ

#### Prisma

| 項目 | 状況 |
|------|------|
| GitHubスター | ~40,000 |
| 週間ダウンロード | ~3,500,000 |
| 成熟度 | 成熟（2019年〜） |
| エンタープライズサポート | あり（Prisma Data Platform） |
| コミュニティ | 非常に活発 |
| ドキュメント | 非常に充実 |

#### Drizzle ORM

| 項目 | 状況 |
|------|------|
| GitHubスター | ~25,000 |
| 週間ダウンロード | ~600,000 |
| 成熟度 | 新しい（2022年〜） |
| エンタープライズサポート | コミュニティベース |
| コミュニティ | 急成長中 |
| ドキュメント | 充実してきている |

### 7. Next.js統合比較

#### Prisma with Next.js

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// app/api/users/route.ts
import { prisma } from '@/lib/prisma'

export async function GET() {
  const users = await prisma.user.findMany()
  return Response.json(users)
}
```

#### Drizzle with Next.js

```typescript
// lib/db.ts
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const client = postgres(process.env.DATABASE_URL!)
export const db = drizzle(client)

// app/api/users/route.ts
import { db } from '@/lib/db'
import { users } from '@/lib/schema'

export async function GET() {
  const allUsers = await db.select().from(users)
  return Response.json(allUsers)
}
```

**両方ともNext.jsと問題なく統合可能**

### 8. 型安全性比較

#### Prisma

```typescript
// 完全な型推論
const user = await prisma.user.findUnique({
  where: { id: 1 },
  select: {
    name: true,
    posts: {
      select: {
        title: true,
      },
    },
  },
})

// user の型: { name: string; posts: { title: string }[] }
```

#### Drizzle ORM

```typescript
// 完全な型推論
const user = await db.query.users.findFirst({
  where: eq(users.id, 1),
  columns: {
    name: true,
  },
  with: {
    posts: {
      columns: {
        title: true,
      },
    },
  },
})

// user の型: { name: string; posts: { title: string }[] }
```

**両方とも完全な型安全性を提供**

## 決定マトリックス

| 評価項目 | 重要度 | Prisma | Drizzle | 備考 |
|---------|-------|--------|---------|------|
| 型安全性 | 高 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 引き分け |
| パフォーマンス | 高 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Drizzle優位 |
| 開発体験 | 高 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Prisma優位 |
| 学習コスト | 中 | ⭐⭐⭐ | ⭐⭐⭐⭐ | Drizzleが直感的 |
| エコシステム | 中 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | Prisma優位 |
| ドキュメント | 中 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Prisma優位 |
| バンドルサイズ | 中 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Drizzle優位 |
| SQL制御 | 低 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Drizzle優位 |

## 推奨: 用途に応じた選択

### Prismaを選ぶべき場合

1. **チーム開発**: 複数人での開発、標準化重視
2. **プロトタイピング**: 素早くアプリケーションを構築したい
3. **エンタープライズ**: サポートとエコシステムの成熟度が必要
4. **初心者**: ORMの学習コストを下げたい
5. **GUI必須**: Prisma Studioでのデータ管理が有用

**現在のプロジェクトではPrismaを継続推奨**:
- 既にPrismaが導入済み
- マイグレーション履歴が存在
- 学習用プロジェクトとして標準的なツールの経験が有益

### Drizzle ORMを選ぶべき場合

1. **パフォーマンス重視**: 高速なクエリ実行が必要
2. **サーバーレス**: Edge Runtime、AWS Lambda等
3. **バンドルサイズ削減**: フロントエンドバンドルサイズが重要
4. **SQL制御**: 生成されるSQLを細かく制御したい
5. **TypeScriptネイティブ**: コード生成ステップを避けたい

**新規プロジェクトや移行検討時の選択肢**:
- Vercel Edge Runtime使用時
- パフォーマンスが重要な本番アプリケーション
- SQLの知識を活かしたい場合

## 移行パス（Prisma → Drizzle）

もし将来的にDrizzleへ移行する場合:

```bash
# 1. Drizzle依存関係追加
npm install drizzle-orm postgres
npm install -D drizzle-kit

# 2. Prismaスキーマから変換
# 手動でschema.tsを作成

# 3. 既存マイグレーションを維持
# Prismaのマイグレーション履歴をDrizzleに移植

# 4. 段階的移行
# 新しいクエリはDrizzle、既存はPrismaで並行運用
```

**推奨**: 学習プロジェクトでは並行して両方試すのも有益

## 結論

### 現在のプロジェクト: **Prismaを継続**

**理由**:
1. ✅ 既にPrismaが導入済みで、マイグレーション履歴がある
2. ✅ 学習プロジェクトとして業界標準ツールの経験が有益
3. ✅ 充実したドキュメントとエコシステム
4. ✅ Prisma Studioによる視覚的なデータ管理

### 将来的な選択肢: **用途に応じてDrizzleを検討**

**検討すべきケース**:
- 本番環境でパフォーマンスがボトルネックになった場合
- Edge Runtimeへの移行が必要になった場合
- バンドルサイズの最適化が重要になった場合

### 並行学習の提案

本プロジェクトでは、以下のアプローチも検討可能:

```
/prisma        # 既存のPrismaセットアップ
/drizzle       # 実験的にDrizzleも試す
  /schema.ts
  /migrations
```

両方のORMを小規模に試すことで、実践的な比較ができる。

## 参考資料

- [Prisma Documentation](https://www.prisma.io/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [Drizzle vs Prisma Performance Comparison](https://github.com/drizzle-team/drizzle-orm/blob/main/benchmarks/README.md)
- [Next.js + Prisma Guide](https://www.prisma.io/nextjs)
- [Next.js + Drizzle Guide](https://orm.drizzle.team/docs/get-started-postgresql#nextjs)

## 更新履歴

- 2025-11-13: 初版作成
