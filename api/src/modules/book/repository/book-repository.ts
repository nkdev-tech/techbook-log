import { bookTable } from '../../../db/schema';
import { db } from '../../../db'
import { type Book } from '../entity/book';

export const BookRepository = {
  findAll: async (): Promise<Book[]> => {
    return await db.select().from(bookTable)
  }
}
