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
}
