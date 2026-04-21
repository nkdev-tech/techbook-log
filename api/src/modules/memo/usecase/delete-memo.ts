import { MemoRepository } from '../repository/memo-repository'
import { type SelectMemo } from '../entity/memo'

export const deleteMemo = async (
  id: number,
  d1: D1Database,
): Promise<SelectMemo | null> => {
  return await MemoRepository.delete(id, d1)
}
