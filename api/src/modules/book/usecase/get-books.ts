import { BookRepository } from '../repository/book-repository'
import { type Book, type BookSortBy, type BookSortOrder } from '../entity/book'

export const getBooks = async (
  userId: string,
  query: string[],
  status?: Book['status'],
  sortBy?: BookSortBy,
  order?: BookSortOrder,
  cursor?: string,
  limit?: number,
): Promise<{ books: Book[]; nextCursor: string | null }> => {
  const { lastId, lastCreatedAt, lastTitle, lastRating } = cursor
    ? JSON.parse(decodeURIComponent(atob(cursor)))
    : {}
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
    limit,
  )
  const lastBook = result[result.length - 1]
  return {
    books: result,
    nextCursor:
      result.length === limit
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
