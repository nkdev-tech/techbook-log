import { bookTable } from '../../../db/schema'
import { createDb } from '../../../db'
import { type InsertBook, type SelectBook } from '../entity/book'
import { eq } from 'drizzle-orm'

export const BookRepository = {
  findAll: async (d1: D1Database): Promise<SelectBook[]> => {
    const db = createDb(d1)
    return await db.select().from(bookTable)
  },
  create: async (data: InsertBook, d1: D1Database): Promise<SelectBook> => {
    const db = createDb(d1)
    return await db.insert(bookTable).values(data).returning().get()
  },
  findById: async (id: number, d1: D1Database): Promise<SelectBook | null> => {
    const db = createDb(d1)
    const result = await db.select().from(bookTable).where(eq(bookTable.id, id))
    return result[0] ?? null
  },
  update: async (
    id: number,
    data: InsertBook,
    d1: D1Database,
  ): Promise<SelectBook | null> => {
    const db = createDb(d1)
    const result = await db
      .update(bookTable)
      .set(data)
      .where(eq(bookTable.id, id))
      .returning()
    return result[0] ?? null
  },
  delete: async (id: number, d1: D1Database): Promise<SelectBook | null> => {
    const db = createDb(d1)
    const result = await db.delete(bookTable).where(eq(bookTable.id, id)).returning().get()
    return result ?? null
  },
}
