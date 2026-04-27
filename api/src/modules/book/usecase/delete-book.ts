import { BookRepository } from '../repository/book-repository'
import { type Book } from '../entity/book'

export const deleteBook = async (
  id: number,
  userId: string,
): Promise<Book | null> => {
  return await BookRepository.delete(id, userId)
}
