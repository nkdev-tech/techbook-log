import { bookTable, memoTable } from '../../../db/schema'
import { db } from '../../../db'
import { type InsertMemo, type SelectMemo } from '../entity/memo'
import { and, asc, eq, inArray } from 'drizzle-orm'

export const MemoRepository = {
  findByBookId: async (
    bookId: number,
    userId: string,
  ): Promise<SelectMemo[]> => {
    return await db
      .select({
        id: memoTable.id,
        content: memoTable.content,
        bookId: memoTable.bookId,
        pageNo: memoTable.pageNo,
        createdAt: memoTable.createdAt,
        updatedAt: memoTable.updatedAt,
      })
      .from(memoTable)
      .innerJoin(bookTable, eq(memoTable.bookId, bookTable.id))
      .where(and(eq(memoTable.bookId, bookId), eq(bookTable.userId, userId)))
      .orderBy(asc(memoTable.createdAt))
  },
  create: async (data: InsertMemo): Promise<SelectMemo> => {
    const result = await db.insert(memoTable).values(data).returning().get()
    return result
  },
  findById: async (id: number, userId: string): Promise<SelectMemo | null> => {
    const result = await db
      .select({
        id: memoTable.id,
        content: memoTable.content,
        pageNo: memoTable.pageNo,
        bookId: memoTable.bookId,
        createdAt: memoTable.createdAt,
        updatedAt: memoTable.updatedAt,
      })
      .from(memoTable)
      .innerJoin(bookTable, eq(memoTable.bookId, bookTable.id))
      .where(and(eq(memoTable.id, id), eq(bookTable.userId, userId)))
    return result[0] ?? null
  },
  update: async (
    id: number,
    userId: string,
    data: Partial<InsertMemo>,
  ): Promise<SelectMemo | null> => {
    const result = await db
      .update(memoTable)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(
        and(
          inArray(
            memoTable.bookId,
            db
              .select({ id: bookTable.id })
              .from(bookTable)
              .where(eq(bookTable.userId, userId)),
          ),
          eq(memoTable.id, id),
        ),
      )
      .returning()
      .get()
    return result ?? null
  },
  delete: async (id: number, userId: string): Promise<SelectMemo | null> => {
    const result = await db
      .delete(memoTable)
      .where(
        and(
          inArray(
            memoTable.bookId,
            db
              .select({ id: bookTable.id })
              .from(bookTable)
              .where(eq(bookTable.userId, userId)),
          ),
          eq(memoTable.id, id),
        ),
      )
      .returning()
      .get()
    return result ?? null
  },
}
