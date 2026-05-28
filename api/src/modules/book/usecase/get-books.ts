import { BookRepository } from '../repository/book-repository'
import { type Book, type BookSortBy, type BookSortOrder } from '../entity/book'
import { z } from 'zod'

export class BadRequestError extends Error {}

const cursorSchema = z.object({
  lastId: z.number(),
  lastCreatedAt: z.string(),
  lastTitle: z.string(),
  lastRating: z.number().nullable(),
})

const decode = (cursor: string) => {
  try {
    const parsed = JSON.parse(decodeURIComponent(atob(cursor)))
    return cursorSchema.parse(parsed)
  } catch {
    throw new BadRequestError('invalid cursor')
  }
}

export const getBooks = async (
  userId: string,
  query: string[],
  status?: Book['status'],
  sortBy?: BookSortBy,
  order?: BookSortOrder,
  cursor?: string,
  limit?: number,
  keyword?: string,
): Promise<{ books: Book[]; nextCursor: string | null }> => {
  const { lastId, lastCreatedAt, lastTitle, lastRating } = cursor
    ? decode(cursor)
    : {}
  const effectiveLimit = limit ?? 20
  const result = await BookRepository.findAll(
    userId,
    query,
    status,
    sortBy,
    order,
    lastId,
    lastCreatedAt,
    lastTitle,
    lastRating,
    effectiveLimit,
    keyword,
  )
  const lastBook = result[result.length - 1]
  return {
    books: result,
    nextCursor:
      result.length === effectiveLimit
        ? btoa(
            encodeURIComponent(
              JSON.stringify({
                lastId: lastBook.id,
                lastCreatedAt: lastBook.createdAt,
                lastTitle: lastBook.title,
                lastRating: lastBook.rating,
              }),
            ),
          )
        : null,
  }
}
