import { BookRepository } from '../repository/book-repository'
import { type InsertBook, type SelectBook } from '../entity/book'

export const createBook = async (
  data: InsertBook,
  d1: D1Database,
): Promise<SelectBook> => {
  const book: InsertBook = {
    ...data,
    finishedAt: data.status === 'done' ? data.finishedAt : null,
  }
  return await BookRepository.create(book, d1)
}
