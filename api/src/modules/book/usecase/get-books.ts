import { BookRepository } from '../repository/book-repository'
import { type Book, type BookSortBy, type BookSortOrder } from '../entity/book'

export const getBooks = async (
  userId: string,
  query: string[],
  status?: Book['status'],
  sortBy?: BookSortBy,
  order?: BookSortOrder,
): Promise<Book[]> => {
  return await BookRepository.findAll(userId, query, status, sortBy, order)
}
