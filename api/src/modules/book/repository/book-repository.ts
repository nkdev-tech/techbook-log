import { bookTable } from '../../../db/schema'
import { createDb } from '../../../db'
import { toBook, type Book, type InsertBook } from '../entity/book'
import { eq } from 'drizzle-orm'

export const BookRepository = {
  findAll: async (d1: D1Database): Promise<Book[]> => {
    const db = createDb(d1)
    const rows = await db.query.bookTable.findMany({
      with: {
        taggings: {
          orderBy: (taggings, { asc }) => [asc(taggings.order)],
          with: {
            tag: true,
          },
        },
      },
    })
    return rows.map(toBook)
  },
  create: async (data: InsertBook, d1: D1Database): Promise<Book> => {
    const db = createDb(d1)
    const result = await db.insert(bookTable).values(data).returning().get()
    return toBook(result)
  },
  findById: async (id: number, d1: D1Database): Promise<Book | null> => {
    const db = createDb(d1)
    const result = await db.query.bookTable.findFirst({
      where: eq(bookTable.id, id),
      with: {
        taggings: {
          orderBy: (taggings, { asc }) => [asc(taggings.order)],
          with: {
            tag: true,
          },
        },
      },
    })
    return result ? toBook(result) : null
  },
  update: async (
    id: number,
    data: InsertBook,
    d1: D1Database,
  ): Promise<Book | null> => {
    const db = createDb(d1)
    const result = await db
      .update(bookTable)
      .set(data)
      .where(eq(bookTable.id, id))
      .returning()
    return result[0] ? toBook(result[0]) : null
  },
  delete: async (id: number, d1: D1Database): Promise<Book | null> => {
    const db = createDb(d1)
    const result = await db
      .delete(bookTable)
      .where(eq(bookTable.id, id))
      .returning()
      .get()
    return result ? toBook(result) : null
  },
}
