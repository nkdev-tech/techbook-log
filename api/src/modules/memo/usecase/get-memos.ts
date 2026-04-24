import { MemoRepository } from '../repository/memo-repository'
import { type SelectMemo } from '../entity/memo'

export const getMemos = async (
  bookId: number,
  userId: string,
): Promise<SelectMemo[]> => {
  return await MemoRepository.findByBookId(bookId, userId)
}
