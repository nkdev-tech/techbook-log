# Delete Memo Design

## Overview

メモ削除機能の実装。API層（Repository・usecase・route）とWeb層（削除ボタン・確認ダイアログ・一覧更新）を追加する。

## API Layer

### MemoRepository.delete

```
delete(id: number, d1: D1Database): Promise<void>
```

- `eq(memoTable.id, id)` で削除
- 返り値なし（存在チェックは usecase 側で行う）

### deleteMemo usecase

```
deleteMemo(id: number, d1: D1Database): Promise<true | null>
```

1. `MemoRepository.findById(id, d1)` で存在確認
2. 存在しなければ `null` を返す
3. 存在すれば `MemoRepository.delete(id, d1)` を呼び出し `true` を返す

### DELETE /books/{id}/memos/{memoId}

- params: `memoParamSchema`（既存）
- responses:
  - 204 No Content — 削除成功
  - 404 Not Found — メモが見つからない場合

## Web Layer

### Memo.tsx の変更

- ゴミ箱アイコンボタン（`Trash2` from lucide-react）を追加
- shadcn/ui `AlertDialog` で確認ダイアログを表示
- `useDeleteApiBooksIdMemosMemoId` フック（orval 生成）で DELETE を呼び出す
- 削除成功後、TanStack Query の `invalidateQueries` でメモ一覧を再取得

### Props の追加

```ts
type Props = {
  memo: { id: number; content: string }
  onEdit: () => void
  bookId: string  // invalidateQueries に使用
}
```

## Testing

### deleteMemo usecase テスト

- メモが存在する場合: `delete` が呼ばれ `true` を返す
- メモが存在しない場合: `delete` が呼ばれず `null` を返す

### DELETE ルートテスト

- 正常系: 204 を返す
- 異常系: 存在しない memoId → 404 を返す

## Acceptance Criteria

- Memo カードにホバーで削除ボタンが表示される
- 削除ボタン押下で確認ダイアログが表示される
- 確認後にメモが削除され、一覧から消える
- キャンセル時はメモが削除されない
