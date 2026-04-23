import { BookRepository } from '../repository/book-repository'
import { type Book } from '../entity/book'

export const getBook = async (id: number): Promise<Book | null> => {
  return await BookRepository.findById(id)
}
