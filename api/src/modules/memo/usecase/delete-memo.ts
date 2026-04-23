import { MemoRepository } from '../repository/memo-repository'
import { type SelectMemo } from '../entity/memo'

export const deleteMemo = async (id: number): Promise<SelectMemo | null> => {
  return await MemoRepository.delete(id)
}
