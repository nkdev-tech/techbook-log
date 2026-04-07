import { BookRepository } from '../repository/book-repository'
import { type InsertBook, type SelectBook } from '../entity/book'

export const createBook = async (
  data: InsertBook,
  d1: D1Database,
): Promise<SelectBook> => {
  return await BookRepository.create(data, d1)
}
