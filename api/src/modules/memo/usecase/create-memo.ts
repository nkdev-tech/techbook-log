import { MemoRepository } from '../repository/memo-repository'
import { type SelectMemo, type InsertMemo } from '../entity/memo'
import { BookRepository } from '../../book/repository/book-repository'

export const createMemo = async (
  userId: string,
  data: InsertMemo,
): Promise<SelectMemo | null> => {
  const book = await BookRepository.findById(data.bookId, userId)
  if (!book) {
    return null
  }
  return await MemoRepository.create(data)
}
