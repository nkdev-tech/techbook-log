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
  delete: async (id: number, d1: D1Database): Promise<SelectMemo | null> => {
    const db = createDb(d1)
    const result = await db
      .delete(memoTable)
      .where(eq(memoTable.id, id))
      .returning()
      .get()
    return result ?? null
  },
}
