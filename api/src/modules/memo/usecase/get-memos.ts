import { MemoRepository } from '../repository/memo-repository'
import { type SelectMemo } from '../entity/memo'

export const getMemos = async (
  id: number,
  d1: D1Database,
): Promise<SelectMemo[]> => {
  return await MemoRepository.findByBookId(id, d1)
}
