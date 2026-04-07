import { BookRepository } from '../repository/book-repository'
import { type SelectBook } from '../entity/book'

export const getBooks = async (d1: D1Database): Promise<SelectBook[]> => {
  return await BookRepository.findAll(d1)
}
