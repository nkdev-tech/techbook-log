import { BookRepository } from '../repository/book-repository'
import { type Book } from '../entity/book'

export const getBooks = async (
  userId: string,
  query: string[],
): Promise<Book[]> => {
  return await BookRepository.findAll(userId, query)
}
