import { MemoRepository } from '../repository/memo-repository'
import { type MemoSearchResult } from '../entity/memo'

export const searchMemos = async (
  userId: string,
  keyword: string,
): Promise<MemoSearchResult[]> => {
  return await MemoRepository.findByKeyword(userId, keyword)
}
