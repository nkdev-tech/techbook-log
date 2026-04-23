import { MemoRepository } from '../repository/memo-repository'
import { type SelectMemo } from '../entity/memo'

export const getMemos = async (bookId: number): Promise<SelectMemo[]> => {
  return await MemoRepository.findByBookId(bookId)
}
