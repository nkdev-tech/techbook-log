import { taggingTable } from '../../../db/schema'
import { createDb } from '../../../db'
import { eq } from 'drizzle-orm'

export const TaggingRepository = {
  create: async (bookId: number, tagId: number, d1: D1Database): Promise<void> => {
    const db = createDb(d1)
    await db.insert(taggingTable).values({ bookId, tagId })
  },
  deleteByBookId: async (bookId: number, d1: D1Database): Promise<void> => {
    const db = createDb(d1)
    await db.delete(taggingTable).where(eq(taggingTable.bookId, bookId))
  },
}
