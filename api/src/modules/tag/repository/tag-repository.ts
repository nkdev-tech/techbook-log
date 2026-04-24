import { taggingTable, tagTable } from '../../../db/schema'
import { db } from '../../../db'
import { type InsertTag, type SelectTag } from '../entity/tag'
import { and, eq } from 'drizzle-orm'

export const TagRepository = {
  findOrCreate: async (data: InsertTag): Promise<SelectTag> => {
    return await db
      .insert(tagTable)
      .values(data)
      .onConflictDoUpdate({
        target: [tagTable.userId, tagTable.name],
        set: { name: data.name },
      })
      .returning()
      .get()
  },
  findByBookId: async (
    bookId: number,
    userId: string,
  ): Promise<SelectTag[]> => {
    return await db
      .select({
        id: tagTable.id,
        name: tagTable.name,
        userId: tagTable.userId,
        createdAt: tagTable.createdAt,
      })
      .from(tagTable)
      .innerJoin(taggingTable, eq(tagTable.id, taggingTable.tagId))
      .where(and(eq(taggingTable.bookId, bookId), eq(tagTable.userId, userId)))
      .orderBy(taggingTable.order)
  },
  findAll: async (userId: string): Promise<SelectTag[]> => {
    return await db
      .select()
      .from(tagTable)
      .where(eq(tagTable.userId, userId))
      .orderBy(tagTable.name)
  },
}
