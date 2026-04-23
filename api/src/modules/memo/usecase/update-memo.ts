import { MemoRepository } from '../repository/memo-repository'
import { type SelectMemo, type InsertMemo } from '../entity/memo'

export const updateMemo = async (
  id: number,
  data: Pick<InsertMemo, 'content'>,
): Promise<SelectMemo | null> => {
  const memo = await MemoRepository.findById(id)
  if (!memo) {
    return null
  }
  return await MemoRepository.update(id, data)
}
