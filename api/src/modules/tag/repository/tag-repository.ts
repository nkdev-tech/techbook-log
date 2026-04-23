import { taggingTable, tagTable } from '../../../db/schema'
import { db } from '../../../db'
import { type InsertTag, type SelectTag } from '../entity/tag'
import { eq } from 'drizzle-orm'

export const TagRepository = {
  findOrCreate: async (data: InsertTag): Promise<SelectTag> => {
    return await db
      .insert(tagTable)
      .values(data)
      .onConflictDoUpdate({ target: tagTable.name, set: { name: data.name } })
      .returning()
      .get()
  },
  findByBookId: async (bookId: number): Promise<SelectTag[]> => {
    return await db
      .select({
        id: tagTable.id,
        name: tagTable.name,
        createdAt: tagTable.createdAt,
      })
      .from(tagTable)
      .innerJoin(taggingTable, eq(tagTable.id, taggingTable.tagId))
      .where(eq(taggingTable.bookId, bookId))
      .orderBy(taggingTable.order)
  },
  findAll: async (): Promise<SelectTag[]> => {
    return await db.select().from(tagTable).orderBy(tagTable.name)
  },
}
