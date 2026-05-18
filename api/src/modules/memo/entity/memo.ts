import { memoTable } from '../../../db/schema'

export type SelectMemo = typeof memoTable.$inferSelect

export type InsertMemo = typeof memoTable.$inferInsert

export type MemoSearchResult = SelectMemo & { bookTitle: string }
