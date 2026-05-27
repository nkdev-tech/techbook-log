import { bookTable, taggingTable, tagTable } from '../../../db/schema'
import { db } from '../../../db'
import {
  toBook,
  type Book,
  type InsertBook,
  type BookSortBy,
  type BookSortOrder,
} from '../entity/book'
import { and, eq, gt, inArray, like, lt, or, sql } from 'drizzle-orm'

export const BookRepository = {
  findAll: async (
    userId: string,
    query: string[],
    status?: Book['status'],
    sortBy?: BookSortBy,
    order?: BookSortOrder,
    lastId?: number,
    lastCreatedAt?: string,
    lastTitle?: string,
    lastRating?: number | null,
    limit?: number,
    keyword?: string,
  ): Promise<Book[]> => {
    const columnMap = {
      createdAt: bookTable.createdAt,
      title: bookTable.title,
      rating: bookTable.rating,
    }
    const sortColumn = sortBy ? columnMap[sortBy] : bookTable.createdAt
    const lastSortValue =
      sortBy === 'title'
        ? lastTitle
        : sortBy === 'rating'
          ? lastRating
          : lastCreatedAt
    const cursorCondition =
      lastId && lastSortValue !== undefined && lastSortValue !== null
        ? order === 'asc'
          ? or(
              gt(sortColumn, lastSortValue),
              and(eq(sortColumn, lastSortValue), gt(bookTable.id, lastId)),
            )
          : or(
              lt(sortColumn, lastSortValue),
              and(eq(sortColumn, lastSortValue), lt(bookTable.id, lastId)),
            )
        : undefined
    const escaped = keyword
      ? keyword.replace(/%/g, '\\%').replace(/_/g, '\\_')
      : ''
    const keywordCondition = keyword
      ? or(
          like(bookTable.title, `%${escaped}%`),
          like(bookTable.author, `%${escaped}%`),
        )
      : undefined

    if (query.length === 0) {
      const rows = await db.query.bookTable.findMany({
        where: and(
          inArray(bookTable.userId, [userId]),
          status ? eq(bookTable.status, status) : undefined,
          cursorCondition,
          keywordCondition,
        ),
        orderBy: (fields, { asc, desc }) => [
          order === 'asc' ? asc(sortColumn) : desc(sortColumn),
          asc(fields.id),
        ],
        limit: limit,
        with: {
          taggings: {
            orderBy: (fields, { asc }) => [asc(fields.order)],
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
      .where(and(inArray(tagTable.name, query), eq(tagTable.userId, userId)))
      .groupBy(taggingTable.bookId)
      .having(sql`COUNT(DISTINCT ${tagTable.name}) = ${query.length}`)

    if (bookIds.length === 0) return []

    const rows = await db.query.bookTable.findMany({
      where: and(
        inArray(
          bookTable.id,
          bookIds.map((r) => r.bookId),
        ),
        status ? eq(bookTable.status, status) : undefined,
        cursorCondition,
        keywordCondition,
      ),
      orderBy: (fields, { asc, desc }) => [
        order === 'asc' ? asc(sortColumn) : desc(sortColumn),
        asc(fields.id),
      ],
      limit: limit,
      with: {
        taggings: {
          orderBy: (fields, { asc }) => [asc(fields.order)],
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
  findById: async (id: number, userId: string): Promise<Book | null> => {
    const result = await db.query.bookTable.findFirst({
      where: and(eq(bookTable.id, id), eq(bookTable.userId, userId)),
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
      .where(and(eq(bookTable.id, id), eq(bookTable.userId, data.userId)))
      .returning()
    return result[0] ? toBook(result[0]) : null
  },
  delete: async (id: number, userId: string): Promise<Book | null> => {
    const result = await db
      .delete(bookTable)
      .where(and(eq(bookTable.id, id), eq(bookTable.userId, userId)))
      .returning()
      .get()
    return result ? toBook(result) : null
  },
}
