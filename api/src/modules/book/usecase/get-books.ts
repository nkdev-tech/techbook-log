import { BookRepository } from '../repository/book-repository'
import { type Book } from '../entity/book'

export const getBooks = async (
  query: string[],
  d1: D1Database,
): Promise<Book[]> => {
  return await BookRepository.findAll(query, d1)
}
