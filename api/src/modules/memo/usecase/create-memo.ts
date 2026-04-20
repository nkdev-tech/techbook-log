import { MemoRepository } from '../repository/memo-repository'
import { type SelectMemo, type InsertMemo } from '../entity/memo'
import { BookRepository } from '../../book/repository/book-repository'

export const createMemo = async (
  data: InsertMemo,
  d1: D1Database,
): Promise<SelectMemo | null> => {
  const book = await BookRepository.findById(data.bookId, d1)
  if (!book) {
    return null
  }
  return await MemoRepository.create(data, d1)
}
