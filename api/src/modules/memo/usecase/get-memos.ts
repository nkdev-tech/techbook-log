import { MemoRepository } from '../repository/memo-repository'
import { type SelectMemo } from '../entity/memo'

export const getMemos = async (
  bookId: number,
  d1: D1Database,
): Promise<SelectMemo[]> => {
  return await MemoRepository.findByBookId(bookId, d1)
}
