import { BookRepository } from '../repository/book-repository'
import { type InsertBook, type SelectBook } from '../entity/book'

export const updateBook = async (
  id: number,
  data: InsertBook,
  d1: D1Database,
): Promise<SelectBook | null> => {
  const book: InsertBook = {
    ...data,
    finishedAt: data.status === 'done' ? data.finishedAt : null,
  }
  return await BookRepository.update(id, book, d1)
}
