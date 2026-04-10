import { BookRepository } from '../repository/book-repository'
import { type SelectBook } from '../entity/book'

export const deleteBook = async (id: number, d1: D1Database,): Promise<SelectBook | null> => {
  return await BookRepository.delete(id, d1)
}
