# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## このプロジェクトの目的

オールTypeScriptの学習が主目的。開発者はRails歴3年で、TypeScriptエコシステムを実践的に習得するためにこのプロジェクトを進めている。

**サポート方針:** 実装の質問に対してコードをいきなり提示しない。まず自分で考えさせ、詰まった場合はヒントを段階的に出して答えに導く。

**スキル実行前の確認:** スキルを呼び出す前に必ずこのファイルの開発フローを確認し、そのステップに応じた追加指示を漏らさないこと。

**テストを書く対象:** `api/` の usecase（`api/src/modules/*/usecase/`）とリクエストテスト（`api/src/test/`）のみ。`web/` のコンポーネント・ページ・middleware.ts にはテストを書かない。

**開発フロー（TDD）:**
1. 設計相談 — 何を作るか・どんなテストが必要か整理。IssueごとにAC（完了条件）を定義する。ACはUI/フロントエンドの振る舞いのみ記載し、APIやrepositoryの実装詳細は含めない。定義したACは必ずGitHub Issueのbodyに書き込む。曖昧な点・不明点は必ずユーザーに質問する
2. issueに紐づくブランチを作成する
3. テストを自分で書く（対象は api/ の usecase と api/src/test/ のリクエストテストのみ）
4. テストが失敗することを確認（red）— 実装前に必ず `npm test` を実行してredを確認するよう促す
5. 実装を自分で書く
6. PR作成 — bodyに必ず `Closes #<issue番号>` を含めてissueを紐づける。PRタイトルはissueタイトルと同じにする
7. レビュー依頼 — 別スレッドでPRを見ながら行う。`web/` のコンポーネントを含む場合は `tailwind-consistency-review` スキルを必ず使ってTailwindの整合性チェックも行う
8. リファクタリング（必要なら相談しながら）

## 概要

技術書の読書記録を管理するモノレポ。`web/`（Next.js）と `api/`（Hono on Cloudflare Workers）の2パッケージ構成。

## コマンド

各コマンドは `web/` または `api/` ディレクトリ内で実行する。

### API (`api/`)

```bash
npm run dev              # 開発サーバー起動（wrangler dev）
npm test                 # テスト実行（vitest）
npm run migrate:generate # Drizzle マイグレーションファイル生成
npm run migrate:apply    # ローカルD1にマイグレーション適用
```

### Web (`web/`)

```bash
npm run dev      # 開発サーバー起動（Next.js）
npm test         # テスト実行（Jest + Testing Library）
npm run generate # orval で API クライアント再生成（APIサーバー起動が必要）
```

## アーキテクチャ

### API

Hono + `@hono/zod-openapi` でOpenAPI定義とルートハンドラを共存させている。DBはCloudflare D1（SQLite）、ORMはDrizzle。

レイヤー構成（`api/src/modules/<domain>/`）:
- `entity/` — DBスキーマから派生した型定義と変換関数
- `repository/` — Drizzle を使ったDB操作
- `usecase/` — ビジネスロジック（repositoryを組み合わせる）
- `routes/<domain>/` — Honoルート定義とzodスキーマ（OpenAPI仕様を兼ねる）

新しいドメインを追加するときは `modules/` と `routes/` の両方に追加し、`api/src/index.ts` でルートをマウントする。

`api/src/routes/<domain>/index.ts` がOpenAPI仕様を自動生成するため、`/doc` エンドポイントからスペックを取得できる。

### Web

`web/src/external/api.ts` は **orval が自動生成するファイル**（手動編集不可）。APIスペックの変更後は `npm run generate` で再生成する。

`web/src/external/custom-fetch.ts` — orval のカスタムフェッチャー。環境変数 `NEXT_PUBLIC_API_URL` をベースURLとして注入し、エラーハンドリングを統一している。

データフェッチには TanStack Query（自動生成フックを利用）、フォーム管理には TanStack Form を使用。UIコンポーネントは shadcn/ui ベース。

### DBスキーマ変更の手順

1. `api/src/db/schema.ts` を編集
2. `api/` で `npm run migrate:generate`
3. `api/` で `npm run migrate:apply`
4. entity型・repositoryを更新
5. APIスペック変更があれば `web/` で `npm run generate`
