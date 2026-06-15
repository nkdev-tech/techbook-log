# memetec.

技術書の読書記録を管理するWebアプリ。

---

# 1. コンセプト

- 読んだ技術書を登録して記録を残す
- 本ごとにメモを追加・管理
- タグで本を分類・整理
- 自分だけの読書ログとして積み上げる

**最終ゴール:** 技術書から得た学びをストックし、いつでも振り返れる場所を作る

---

# 2. ターゲット

- 技術書をよく読むエンジニア
- 読んだ内容を忘れがちな人
- 学びをアウトプットしたい個人開発者

---

# 3. 機能

- 本の登録・管理（書名検索で書誌情報を自動入力、書影表示）
- 本ごとのメモ管理（Markdown 対応・ページ番号付き）
- タグによる分類
- メモのキーワード検索
- ログイン（自分だけの記録）

---

# 4. 技術スタック

| レイヤー | 技術 |
|---|---|
| フロントエンド | Next.js 16 / React 19 / Tailwind CSS v4 / shadcn/ui |
| API | Hono + @hono/zod-openapi |
| DB | Cloudflare D1（SQLite）/ Drizzle ORM |
| インフラ | Cloudflare Workers（API は Hono、Web は Next.js を OpenNext でデプロイ） |
| 認証 | better-auth |
| メール送信 | Resend（認証メール） |
| 状態管理・フォーム | TanStack Query / TanStack Form |
| APIクライアント生成 | orval（OpenAPIスペックから自動生成） |
| テスト | Vitest（API）/ Jest + Testing Library（Web） |

---

# 5. アーキテクチャ

モノレポ構成。`api/` と `web/` の2パッケージ。

```
memetec/
├── api/   # Hono on Cloudflare Workers
└── web/   # Next.js（OpenNext）on Cloudflare Workers
```

### API レイヤー構成

ビジネスロジックは `api/src/modules/<domain>/` 配下の3レイヤー、ルート定義は別のトップレベル `api/src/routes/<domain>/` に分かれている。

```
api/src/
├── modules/<domain>/
│   ├── entity/      # DB スキーマから派生した型と変換関数
│   ├── repository/  # Drizzle を使った DB 操作
│   └── usecase/     # ビジネスロジック
└── routes/<domain>/ # Hono ルート定義 + Zod スキーマ（OpenAPI 兼用）
```

API の `/doc` エンドポイントから OpenAPI スペックを取得できる。
Web 側はそのスペックから `npm run generate` で API クライアントを自動生成する。

---

# 6. セットアップ

```bash
# API
cd api
npm install
cp .env.example .env          # drizzle-kit 用（CLOUDFLARE_ACCOUNT_ID / DATABASE_ID / D1_TOKEN）
cp .dev.vars.example .dev.vars # Worker ランタイムのシークレット（BETTER_AUTH_SECRET / RESEND_API_KEY 等）
npm run migrate:apply         # ローカル D1 にマイグレーション適用
npm run dev

# Web（別ターミナル）
cd web
npm install
cp .env.example .env          # NEXT_PUBLIC_API_URL を設定
npm run dev
```

環境変数の置き場所は用途で分かれている:

| ファイル | 用途 | 例 |
|---|---|---|
| `api/.env` | drizzle-kit（マイグレーション）が `dotenv` で読む | `CLOUDFLARE_ACCOUNT_ID` `CLOUDFLARE_DATABASE_ID` `CLOUDFLARE_D1_TOKEN` |
| `api/.dev.vars` | Worker ランタイムのシークレット（本番は Cloudflare Secrets） | `BETTER_AUTH_SECRET` `RESEND_API_KEY` `GOOGLE_CLIENT_SECRET` 等 |
| `api/wrangler.jsonc` の `vars` | 公開してよい設定値 | `BETTER_AUTH_URL` `ORIGIN_URL` `ENV` |

---

# 7. 主要コマンド

### API (`api/`)

| コマンド | 説明 |
|---|---|
| `npm run dev` | 開発サーバー起動 |
| `npm test` | テスト実行 |
| `npm run migrate:generate` | マイグレーションファイル生成 |
| `npm run migrate:apply` | ローカル D1 にマイグレーション適用 |
| `npm run deploy` | Cloudflare Workers にデプロイ |

### Web (`web/`)

| コマンド | 説明 |
|---|---|
| `npm run dev` | 開発サーバー起動 |
| `npm test` | テスト実行 |
| `npm run generate` | orval で API クライアント再生成（API サーバー起動が必要） |
| `npm run preview` | Cloudflare Workers のローカルプレビュー |
| `npm run deploy` | Cloudflare Workers にデプロイ |
