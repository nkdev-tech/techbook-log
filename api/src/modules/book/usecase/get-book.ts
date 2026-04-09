import { BookRepository } from '../repository/book-repository'
import { type SelectBook } from '../entity/book'

export const getBook = async (
  id: number,
  d1: D1Database,
): Promise<SelectBook | null> => {
  return await BookRepository.findById(id, d1)
}
