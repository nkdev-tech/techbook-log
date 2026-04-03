import { bookTable } from '../../../db/schema';
import { createDb } from '../../../db'
import { type Book } from '../entity/book';

export const BookRepository = {
  findAll: async (d1:D1Database): Promise<Book[]> => {
    const db = createDb(d1)
    return await db.select().from(bookTable)
  }
}
