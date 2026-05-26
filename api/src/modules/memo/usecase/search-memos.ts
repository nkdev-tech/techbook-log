import { MemoRepository } from '../repository/memo-repository'
import { type MemoSearchResult } from '../entity/memo'

const decode = (cursor: string) => {
  try {
    return JSON.parse(decodeURIComponent(atob(cursor)))
  } catch {
    throw { status: 400, message: 'Bad Request' }
  }
}

export const searchMemos = async (
  userId: string,
  keyword: string,
  cursor?: string,
  limit?: number,
): Promise<{ memos: MemoSearchResult[]; nextCursor: string | null }> => {
  const { lastId, lastCreatedAt } = cursor ? decode(cursor) : {}
  const result = await MemoRepository.findByKeyword(
    userId,
    keyword,
    lastId,
    lastCreatedAt,
    limit,
  )
  const lastMemo = result[result.length - 1]
  return {
    memos: result,
    nextCursor:
      result.length === limit
        ? btoa(
            encodeURIComponent(
              JSON.stringify({
                lastId: lastMemo.id,
                lastCreatedAt: lastMemo.createdAt,
              }),
            ),
          )
        : null,
  }
}
