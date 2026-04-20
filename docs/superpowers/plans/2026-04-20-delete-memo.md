# Delete Memo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** メモ削除機能を実装する（API層 + Web層）

**Architecture:** `MemoRepository.delete` → `deleteMemo` usecase → `DELETE /books/{id}/memos/{memoId}` ルート。WebはMemo.tsx内のAlertDialogで確認後、TanStack QueryのinvalidateQueriesで一覧更新。

**Tech Stack:** Hono + @hono/zod-openapi, Drizzle ORM, Vitest（API）, Next.js + shadcn/ui + TanStack Query（Web）

---

## File Map

| ファイル | 操作 |
|---|---|
| `api/src/modules/memo/repository/memo-repository.ts` | 修正: `delete` メソッド追加 |
| `api/src/modules/memo/usecase/delete-memo.ts` | 新規作成 |
| `api/src/modules/memo/usecase/delete-memo.test.ts` | 新規作成 |
| `api/src/routes/memos/index.ts` | 修正: DELETEルート追加 |
| `api/src/test/memos.test.ts` | 修正: DELETEのテスト追加 |
| `web/src/components/books/Memo.tsx` | 修正: 削除ボタン + AlertDialog追加 |
| `web/src/components/books/MemoList.tsx` | 修正: `bookId` prop を Memo.tsx に渡す |

---

## Task 1: MemoRepository に delete メソッドを追加

**Files:**
- Modify: `api/src/modules/memo/repository/memo-repository.ts`

- [ ] **Step 1: `delete` メソッドを追加する**

`api/src/modules/memo/repository/memo-repository.ts` を以下の状態にする（`update` メソッドの後に追加）:

```typescript
import { memoTable } from '../../../db/schema'
import { createDb } from '../../../db'
import { type InsertMemo, type SelectMemo } from '../entity/memo'
import { eq } from 'drizzle-orm'

export const MemoRepository = {
  findByBookId: async (
    bookId: number,
    d1: D1Database,
  ): Promise<SelectMemo[]> => {
    const db = createDb(d1)
    return await db.query.memoTable.findMany({
      where: eq(memoTable.bookId, bookId),
      orderBy: (memo, { asc }) => [asc(memo.createdAt)],
    })
  },
  create: async (data: InsertMemo, d1: D1Database): Promise<SelectMemo> => {
    const db = createDb(d1)
    const result = await db.insert(memoTable).values(data).returning().get()
    return result
  },
  findById: async (id: number, d1: D1Database): Promise<SelectMemo | null> => {
    const db = createDb(d1)
    const result = await db.query.memoTable.findFirst({
      where: eq(memoTable.id, id),
    })
    return result ?? null
  },
  update: async (
    id: number,
    data: Partial<InsertMemo>,
    d1: D1Database,
  ): Promise<SelectMemo | null> => {
    const db = createDb(d1)
    const result = await db
      .update(memoTable)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(memoTable.id, id))
      .returning()
      .get()
    return result ?? null
  },
  delete: async (id: number, d1: D1Database): Promise<void> => {
    const db = createDb(d1)
    await db.delete(memoTable).where(eq(memoTable.id, id))
  },
}
```

- [ ] **Step 2: Commit**

```bash
git add api/src/modules/memo/repository/memo-repository.ts
git commit -m "feat: add delete method to MemoRepository"
```

---

## Task 2: deleteMemo usecase を TDD で実装

**Files:**
- Create: `api/src/modules/memo/usecase/delete-memo.test.ts`
- Create: `api/src/modules/memo/usecase/delete-memo.ts`

- [ ] **Step 1: テストを書く**

`api/src/modules/memo/usecase/delete-memo.test.ts` を新規作成:

```typescript
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { deleteMemo } from './delete-memo'
import { MemoRepository } from '../repository/memo-repository'

vi.mock('../repository/memo-repository')

describe('deleteMemo', () => {
  beforeEach(() => vi.clearAllMocks())

  it('can delete memo', async () => {
    const mockMemo = {
      id: 1,
      bookId: 1,
      content: 'メモ1',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }
    vi.mocked(MemoRepository.findById).mockResolvedValue(mockMemo)
    vi.mocked(MemoRepository.delete).mockResolvedValue()

    const mockD1 = {} as D1Database
    const result = await deleteMemo(1, mockD1)

    expect(result).toBe(true)
    expect(MemoRepository.delete).toHaveBeenCalledTimes(1)
    expect(MemoRepository.delete).toHaveBeenCalledWith(1, mockD1)
  })

  it('cannot delete memo when memo does not exist', async () => {
    vi.mocked(MemoRepository.findById).mockResolvedValue(null)

    const mockD1 = {} as D1Database
    const result = await deleteMemo(1, mockD1)

    expect(result).toBeNull()
    expect(MemoRepository.delete).not.toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: テストが失敗することを確認**

```bash
cd api && npm test
```

Expected: `delete-memo.test.ts` が FAIL（`Cannot find module './delete-memo'`）

- [ ] **Step 3: usecase を実装する**

`api/src/modules/memo/usecase/delete-memo.ts` を新規作成:

```typescript
import { MemoRepository } from '../repository/memo-repository'

export const deleteMemo = async (
  id: number,
  d1: D1Database,
): Promise<true | null> => {
  const memo = await MemoRepository.findById(id, d1)
  if (!memo) {
    return null
  }
  await MemoRepository.delete(id, d1)
  return true
}
```

- [ ] **Step 4: テストが通ることを確認**

```bash
cd api && npm test
```

Expected: 全テスト PASS

- [ ] **Step 5: Commit**

```bash
git add api/src/modules/memo/usecase/delete-memo.ts api/src/modules/memo/usecase/delete-memo.test.ts
git commit -m "feat: add deleteMemo usecase"
```

---

## Task 3: DELETE ルートを TDD で追加

**Files:**
- Modify: `api/src/test/memos.test.ts`
- Modify: `api/src/routes/memos/index.ts`

- [ ] **Step 1: ルートテストを書く**

`api/src/test/memos.test.ts` の末尾（最後の `})` の手前）に以下を追加:

```typescript
  it('can delete memo', async () => {
    const mockMemo = {
      id: 1,
      bookId: 1,
      content: 'メモ1',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }
    vi.mocked(MemoRepository.findById).mockResolvedValue(mockMemo)
    vi.mocked(MemoRepository.delete).mockResolvedValue()

    const result = await client.api.books[':id'].memos[':memoId'].$delete({
      param: { id: '1', memoId: '1' },
    })

    expect(result.status).toBe(204)
  })

  it('cannot delete memo when memo does not exist', async () => {
    vi.mocked(MemoRepository.findById).mockResolvedValue(null)

    const result = await client.api.books[':id'].memos[':memoId'].$delete({
      param: { id: '1', memoId: '1' },
    })

    expect(result.status).toBe(404)
  })
```

- [ ] **Step 2: テストが失敗することを確認**

```bash
cd api && npm test
```

Expected: `memos.test.ts` の新しい2テストが FAIL

- [ ] **Step 3: DELETEルートを実装する**

`api/src/routes/memos/index.ts` を以下の最終状態に書き換える:

```typescript
import { OpenAPIHono } from '@hono/zod-openapi'
import { getMemos } from '../../modules/memo/usecase/get-memos'
import { createMemo } from '../../modules/memo/usecase/create-memo'
import { createRoute } from '@hono/zod-openapi'
import {
  createMemoReqSchema,
  createMemoResSchema,
  errorResBodySchema,
  getMemosSchema,
  memoParamSchema,
  updateMemoReqSchema,
  updateMemoResSchema,
  ParamsSchema,
} from './schema'
import { updateMemo } from '../../modules/memo/usecase/update-memo'
import { deleteMemo } from '../../modules/memo/usecase/delete-memo'

type Bindings = {
  DB: D1Database
}

const getMemosRoute = createRoute({
  method: 'get',
  path: '/{id}/memos',
  request: {
    params: ParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getMemosSchema,
        },
      },
      description: 'Retrieve memos',
    },
  },
})

const createMemoRoute = createRoute({
  method: 'post',
  path: '/{id}/memos',
  request: {
    params: ParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: createMemoReqSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: createMemoResSchema,
        },
      },
      description: 'Create a memo',
    },
    400: {
      content: {
        'application/json': {
          schema: errorResBodySchema,
        },
      },
      description: 'Bad Request',
    },
    404: {
      content: {
        'application/json': {
          schema: errorResBodySchema,
        },
      },
      description: 'Not Found',
    },
  },
})

const updateMemoRoute = createRoute({
  method: 'patch',
  path: '/{id}/memos/{memoId}',
  request: {
    params: memoParamSchema,
    body: {
      content: {
        'application/json': {
          schema: updateMemoReqSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: updateMemoResSchema,
        },
      },
      description: 'Update a memo',
    },
    400: {
      content: {
        'application/json': {
          schema: errorResBodySchema,
        },
      },
      description: 'Bad Request',
    },
    404: {
      content: {
        'application/json': {
          schema: errorResBodySchema,
        },
      },
      description: 'Not Found',
    },
  },
})

const deleteMemoRoute = createRoute({
  method: 'delete',
  path: '/{id}/memos/{memoId}',
  request: {
    params: memoParamSchema,
  },
  responses: {
    204: {
      description: 'Delete a memo',
    },
    404: {
      content: {
        'application/json': {
          schema: errorResBodySchema,
        },
      },
      description: 'Not Found',
    },
  },
})

const app = new OpenAPIHono<{ Bindings: Bindings }>()
  .openapi(getMemosRoute, async (c) => {
    const { id } = c.req.valid('param')
    const result = await getMemos(Number(id), c.env.DB)
    return c.json(result, 200)
  })
  .openapi(createMemoRoute, async (c) => {
    const { id } = c.req.valid('param')
    const data = c.req.valid('json')
    const result = await createMemo({ ...data, bookId: Number(id) }, c.env.DB)
    if (result === null) {
      return c.json(
        {
          success: false,
          error: {
            name: 'NotFound',
            message: '関連する本が見つかりませんでした',
          },
        },
        404,
      )
    }
    return c.json(result, 201)
  })
  .openapi(updateMemoRoute, async (c) => {
    const { memoId } = c.req.valid('param')
    const data = c.req.valid('json')
    const result = await updateMemo(Number(memoId), data, c.env.DB)
    if (result === null) {
      return c.json(
        {
          success: false,
          error: {
            name: 'NotFound',
            message: 'メモが見つかりませんでした',
          },
        },
        404,
      )
    }
    return c.json(result, 200)
  })
  .openapi(deleteMemoRoute, async (c) => {
    const { memoId } = c.req.valid('param')
    const result = await deleteMemo(Number(memoId), c.env.DB)
    if (result === null) {
      return c.json(
        {
          success: false,
          error: {
            name: 'NotFound',
            message: 'メモが見つかりませんでした',
          },
        },
        404,
      )
    }
    return c.body(null, 204)
  })

export default app
```

- [ ] **Step 4: テストが通ることを確認**

```bash
cd api && npm test
```

Expected: 全テスト PASS

- [ ] **Step 5: Commit**

```bash
git add api/src/routes/memos/index.ts api/src/test/memos.test.ts
git commit -m "feat: add DELETE /books/{id}/memos/{memoId} route"
```

---

## Task 4: APIクライアントを再生成

**Files:**
- Auto-generated: `web/src/external/api.ts`

- [ ] **Step 1: APIサーバーを起動する**

ターミナル1で:
```bash
cd api && npm run dev
```

- [ ] **Step 2: orval でクライアント再生成**

ターミナル2で:
```bash
cd web && npm run generate
```

Expected: `web/src/external/api.ts` が更新され、`useDeleteApiBooksIdMemosMemoId` フックが追加される

- [ ] **Step 3: 生成されたフックを確認**

```bash
grep -n "useDeleteApiBooksIdMemosMemoId\|getDeleteApiBooksIdMemosMemoId" web/src/external/api.ts
```

Expected: フック名が存在する

- [ ] **Step 4: Commit**

```bash
git add web/src/external/api.ts
git commit -m "chore: regenerate API client with delete memo endpoint"
```

---

## Task 5: Memo.tsx に削除ボタンと確認ダイアログを追加

**Files:**
- Modify: `web/src/components/books/Memo.tsx`
- Modify: `web/src/components/books/MemoList.tsx`

- [ ] **Step 1: MemoList.tsx から bookId を Memo.tsx に渡す**

`web/src/components/books/MemoList.tsx` を以下の状態にする（`Memo` コンポーネントの呼び出し箇所に `bookId={id}` を追加）:

```tsx
import { useState } from "react";
import { useParams } from "next/navigation";
import { useGetApiBooksIdMemos } from "@/external/api";
import { Memo } from "@/components/books/Memo";
import { MemoForm } from "@/components/books/MemoForm";
import { Plus } from "lucide-react";

export function MemoList() {
  const { id } = useParams<{ id: string }>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMemoId, setEditingMemoId] = useState<number | null>(null);
  const { data } = useGetApiBooksIdMemos(id);

  if (!data || data.status !== 200) {
    return null;
  }

  const memos = data.data;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-start gap-4 my-4">
      {memos.map((memo) =>
        editingMemoId === memo.id ? (
          <MemoForm
            key={memo.id}
            memo={memo}
            onSuccess={() => setEditingMemoId(null)}
            onCancel={() => setEditingMemoId(null)}
          />
        ) : (
          <Memo
            key={memo.id}
            memo={memo}
            bookId={id}
            onEdit={() => setEditingMemoId(memo.id)}
          />
        )
      )}
      {isFormOpen ? (
        <MemoForm
          onSuccess={() => setIsFormOpen(false)}
          onCancel={() => setIsFormOpen(false)}
        />
      ) : (
        <button
          type="button"
          className="flex items-center justify-center border-2 border-dashed rounded-none cursor-pointer h-40 w-full"
          onClick={() => setIsFormOpen(true)}
        >
          <Plus size={48} className="text-muted-foreground" />
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Memo.tsx を削除ボタン + AlertDialog 付きに書き換える**

`web/src/components/books/Memo.tsx` を以下の状態にする:

```tsx
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Pen, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  useDeleteApiBooksIdMemosMemoId,
  getGetApiBooksIdMemosQueryKey,
} from "@/external/api";

type Props = {
  memo: {
    id: number;
    content: string;
  };
  bookId: string;
  onEdit: () => void;
};

export function Memo({ memo, bookId, onEdit }: Props) {
  const queryClient = useQueryClient();
  const deleteMemo = useDeleteApiBooksIdMemosMemoId({
    mutation: {
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: getGetApiBooksIdMemosQueryKey(bookId),
        });
      },
    },
  });

  return (
    <Card className="relative bg-yellow-100 rounded-none min-h-40 py-5 group">
      <CardContent className="h-full px-5">
        <p className="whitespace-pre-wrap">{memo.content}</p>
      </CardContent>
      <div className="absolute top-3 right-3 invisible group-hover:visible flex gap-1">
        <Button
          type="button"
          variant="ghost"
          className="bg-yellow-100/80 hover:bg-yellow-100/80 backdrop-blur-xs rounded-full"
          onClick={onEdit}
        >
          <Pen
            size={16}
            className="text-muted-foreground hover:text-foreground"
          />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className="bg-yellow-100/80 hover:bg-yellow-100/80 backdrop-blur-xs rounded-full"
            >
              <Trash2
                size={16}
                className="text-muted-foreground hover:text-foreground"
              />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>メモを削除しますか？</AlertDialogTitle>
              <AlertDialogDescription>
                この操作は取り消せません。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>キャンセル</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  deleteMemo.mutate({ id: bookId, memoId: String(memo.id) })
                }
              >
                削除
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
}
```

- [ ] **Step 3: shadcn/ui AlertDialog コンポーネントが存在するか確認**

```bash
ls web/src/components/ui/alert-dialog.tsx
```

存在しない場合は追加:
```bash
cd web && npx shadcn@latest add alert-dialog
```

- [ ] **Step 4: ビルドが通ることを確認**

```bash
cd web && npm run build
```

Expected: エラーなし

- [ ] **Step 5: Commit**

```bash
git add web/src/components/books/Memo.tsx web/src/components/books/MemoList.tsx
git commit -m "feat: add delete button with confirmation dialog to Memo component"
```
