import { MemoRepository } from '../repository/memo-repository'
import { type MemoSearchResult } from '../entity/memo'
import { z } from 'zod'

export class BadRequestError extends Error {}

const cursorSchema = z.object({
  lastId: z.number(),
  lastCreatedAt: z.string(),
})

const decode = (cursor: string) => {
  try {
    const parsed = JSON.parse(decodeURIComponent(atob(cursor)))
    return cursorSchema.parse(parsed)
  } catch {
    throw new BadRequestError('invalid cursor')
  }
}

export const searchMemos = async (
  userId: string,
  keyword: string,
  cursor?: string,
  limit?: number,
): Promise<{ memos: MemoSearchResult[]; nextCursor: string | null }> => {
  const { lastId, lastCreatedAt } = cursor ? decode(cursor) : {}
  const effectiveLimit = limit ?? 20
  const result = await MemoRepository.findByKeyword(
    userId,
    keyword,
    lastId,
    lastCreatedAt,
    effectiveLimit,
  )
  const lastMemo = result[result.length - 1]
  return {
    memos: result,
    nextCursor:
      result.length === effectiveLimit
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
