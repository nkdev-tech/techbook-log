import { BookRepository } from '../repository/book-repository'
import { toBook, type Book } from '../entity/book'

export const deleteBook = async (
  id: number,
  d1: D1Database,
): Promise<Book | null> => {
  const book = await BookRepository.delete(id, d1)
  return book ? toBook(book) : null
}
