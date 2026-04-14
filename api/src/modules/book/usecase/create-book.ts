import { BookRepository } from '../repository/book-repository'
import { toBook, type Book, type InsertBook } from '../entity/book'
import { TagRepository } from '../../tag/repository/tag-repository'
import { TaggingRepository } from '../../tag/repository/tagging-repository'

export const createBook = async (
  data: InsertBook,
  d1: D1Database,
): Promise<Book> => {
  const { tags, ...bookData } = data
  const book = await BookRepository.create(
    {
      ...bookData,
      finishedAt: data.status === 'done' ? data.finishedAt : null,
    },
    d1,
  )

  if (tags && tags.length > 0) {
    for (const tagData of tags) {
      const tag = await TagRepository.findOrCreate(tagData, d1)
      await TaggingRepository.create(book.id, tag.id, d1)
    }
  }

  const raw = await BookRepository.findById(book.id, d1)
  return toBook(raw!)
}
