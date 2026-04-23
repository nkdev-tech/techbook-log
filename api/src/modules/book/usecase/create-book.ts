import { BookRepository } from '../repository/book-repository'
import { type Book, type InsertBook } from '../entity/book'
import { TagRepository } from '../../tag/repository/tag-repository'
import { TaggingRepository } from '../../tag/repository/tagging-repository'

export const createBook = async (
  data: InsertBook,
): Promise<Book> => {
  const { tags, ...bookData } = data
  const book = await BookRepository.create(
    {
      ...bookData,
      finishedAt: data.status === 'done' ? data.finishedAt : null,
    },
  )

  if (tags && tags.length > 0) {
    for (const [index, tagData] of tags.entries()) {
      const tag = await TagRepository.findOrCreate(tagData)
      await TaggingRepository.create(book.id, tag.id, index)
    }
  }

  return (await BookRepository.findById(book.id)) as Book
}
