import { BookRepository } from '../repository/book-repository'
import { toBook, type Book } from '../entity/book'

export const getBooks = async (d1: D1Database): Promise<Book[]> => {
  const books = await BookRepository.findAll(d1)
  return books.map(toBook)
}
