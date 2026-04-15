import { BookRepository } from '../repository/book-repository'
import { type Book } from '../entity/book'

export const getBook = async (
  id: number,
  d1: D1Database,
): Promise<Book | null> => {
  return await BookRepository.findById(id, d1)
}
