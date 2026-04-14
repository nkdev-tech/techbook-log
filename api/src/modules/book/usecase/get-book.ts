import { BookRepository } from '../repository/book-repository'
import { toBook, type Book } from '../entity/book'

export const getBook = async (
  id: number,
  d1: D1Database,
): Promise<Book | null> => {
  const book = await BookRepository.findById(id, d1)
  return book ? toBook(book) : null
}
