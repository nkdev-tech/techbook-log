import { BookRepository } from '../repository/book-repository'
import { type Book, type InsertBook } from '../entity/book'
import { TagRepository } from '../../tag/repository/tag-repository'
import { TaggingRepository } from '../../tag/repository/tagging-repository'

export class DuplicateIsbnError extends Error {}

export const createBook = async (
  userId: string,
  data: Omit<InsertBook, 'userId'>,
): Promise<Book> => {
  const { tags, ...bookData } = data
  if (bookData.isbn) {
    const sameIsbn = await BookRepository.findByIsbn(bookData.isbn, userId)
    if (sameIsbn !== null) throw new DuplicateIsbnError()
  }

  const book = await BookRepository.create({
    ...bookData,
    userId,
    finishedAt: data.status === 'done' ? data.finishedAt : null,
  })

  if (tags && tags.length > 0) {
    for (const [index, tagData] of tags.entries()) {
      const tag = await TagRepository.findOrCreate({ ...tagData, userId })
      await TaggingRepository.create(book.id, tag.id, index)
    }
  }

  return (await BookRepository.findById(book.id, userId)) as Book
}
