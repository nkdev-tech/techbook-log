import { bookTable } from '../../../db/schema'
import { createDb } from '../../../db'
import { type InsertBook, type SelectBook } from '../entity/book'

export const BookRepository = {
  findAll: async (d1: D1Database): Promise<SelectBook[]> => {
    const db = createDb(d1)
    return await db.select().from(bookTable)
  },
  create: async (data: InsertBook, d1: D1Database): Promise<SelectBook> => {
    const db = createDb(d1)
    return await db.insert(bookTable).values(data).returning().get()
  },
}
