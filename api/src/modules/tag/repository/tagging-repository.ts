import { taggingTable } from '../../../db/schema'
import { db } from '../../../db'
import { eq } from 'drizzle-orm'

export const TaggingRepository = {
  create: async (
    bookId: number,
    tagId: number,
    order: number,
  ): Promise<void> => {
    await db.insert(taggingTable).values({ bookId, tagId, order })
  },
  deleteByBookId: async (bookId: number): Promise<void> => {
    await db.delete(taggingTable).where(eq(taggingTable.bookId, bookId))
  },
}
