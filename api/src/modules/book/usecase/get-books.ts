import { BookRepository } from '../repository/book-repository'
import { type Book } from '../entity/book';

export const getBooks = async (): Promise<Book[]> => {
  return await BookRepository.findAll();
}
