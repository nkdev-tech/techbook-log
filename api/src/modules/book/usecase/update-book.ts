import { BookRepository } from '../repository/book-repository'
import { type Book, type InsertBook } from '../entity/book'
import { TagRepository } from '../../tag/repository/tag-repository'
import { TaggingRepository } from '../../tag/repository/tagging-repository'

export const updateBook = async (
  id: number,
  data: InsertBook,
  d1: D1Database,
): Promise<Book | null> => {
  const { tags, ...bookData } = data
  const book = await BookRepository.update(
    id,
    {
      ...bookData,
      finishedAt: data.status === 'done' ? data.finishedAt : null,
    },
    d1,
  )

  if (book === null) return null

  await TaggingRepository.deleteByBookId(book.id, d1)

  if (tags && tags.length > 0) {
    for (const [index, tagData] of tags.entries()) {
      const tag = await TagRepository.findOrCreate(tagData, d1)
      await TaggingRepository.create(book.id, tag.id, index, d1)
    }
  }

  return await BookRepository.findById(book.id, d1)
}
