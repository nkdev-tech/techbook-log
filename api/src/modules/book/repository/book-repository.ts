import { bookTable, taggingTable, tagTable } from '../../../db/schema'
import { db } from '../../../db'
import { toBook, type Book, type InsertBook } from '../entity/book'
import { eq, inArray, sql } from 'drizzle-orm'

export const BookRepository = {
  findAll: async (query: string[]): Promise<Book[]> => {
    if (query.length === 0) {
      const rows = await db.query.bookTable.findMany({
        with: {
          taggings: {
            orderBy: (taggings, { asc }) => [asc(taggings.order)],
            with: { tag: true },
          },
        },
      })
      return rows.map(toBook)
    }

    const bookIds = await db
      .select({ bookId: taggingTable.bookId })
      .from(taggingTable)
      .innerJoin(tagTable, eq(taggingTable.tagId, tagTable.id))
      .where(inArray(tagTable.name, query))
      .groupBy(taggingTable.bookId)
      .having(sql`COUNT(DISTINCT ${tagTable.name}) = ${query.length}`)

    if (bookIds.length === 0) return []

    const rows = await db.query.bookTable.findMany({
      where: inArray(
        bookTable.id,
        bookIds.map((r) => r.bookId),
      ),
      with: {
        taggings: {
          orderBy: (taggings, { asc }) => [asc(taggings.order)],
          with: { tag: true },
        },
      },
    })

    return rows.map(toBook)
  },
  create: async (data: InsertBook): Promise<Book> => {
    const result = await db.insert(bookTable).values(data).returning().get()
    return toBook(result)
  },
  findById: async (id: number): Promise<Book | null> => {
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
  update: async (id: number, data: InsertBook): Promise<Book | null> => {
    const result = await db
      .update(bookTable)
      .set(data)
      .where(eq(bookTable.id, id))
      .returning()
    return result[0] ? toBook(result[0]) : null
  },
  delete: async (id: number): Promise<Book | null> => {
    const result = await db
      .delete(bookTable)
      .where(eq(bookTable.id, id))
      .returning()
      .get()
    return result ? toBook(result) : null
  },
}
