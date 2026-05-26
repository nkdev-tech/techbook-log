import { describe, expect, it, vi } from 'vitest'
import { searchMemos } from './search-memos'
import { MemoRepository } from '../repository/memo-repository'

vi.mock('../repository/memo-repository')

describe('searchMemos', () => {
  it('can search memos', async () => {
    const mockMemos = [
      {
        id: 1,
        bookId: 1,
        content: 'メモ1',
        pageNo: null,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        bookTitle: 'タイトル1',
        bookThumbnailUrl: 'https://books.google.com/',
      },
      {
        id: 2,
        bookId: 2,
        content: 'メモ2',
        pageNo: 222,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        bookTitle: 'タイトル2',
        bookThumbnailUrl: 'https://books.google.com/',
      },
      {
        id: 3,
        bookId: 3,
        content: 'メモ3',
        pageNo: null,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        bookTitle: 'タイトル3',
        bookThumbnailUrl: null,
      },
    ]

    vi.mocked(MemoRepository.findByKeyword).mockResolvedValue(mockMemos)

    const userId = '1'
    const keyword = 'メモ'
    const cursor = undefined
    const limit = undefined
    const result = await searchMemos(userId, keyword, cursor, limit)

    expect(result).toEqual({ memos: mockMemos, nextCursor: null })
    expect(MemoRepository.findByKeyword).toHaveBeenCalledWith(
      userId,
      keyword,
      undefined,
      undefined,
      undefined,
    )
  })

  it('returns nextCursor when result count equals limit', async () => {
    const mockMemos = [
      {
        id: 1,
        bookId: 1,
        content: 'メモ1',
        pageNo: null,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        bookTitle: 'タイトル1',
        bookThumbnailUrl: 'https://books.google.com/',
      },
      {
        id: 2,
        bookId: 2,
        content: 'メモ2',
        pageNo: 222,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        bookTitle: 'タイトル2',
        bookThumbnailUrl: 'https://books.google.com/',
      },
      {
        id: 3,
        bookId: 3,
        content: 'メモ3',
        pageNo: null,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        bookTitle: 'タイトル3',
        bookThumbnailUrl: null,
      },
    ]

    vi.mocked(MemoRepository.findByKeyword).mockResolvedValue(mockMemos)

    const userId = '1'
    const keyword = 'メモ'
    const lastId = '3'
    const lastCreatedAt = '2026-01-01T00:00:00.000Z'
    const cursor = btoa(
      encodeURIComponent(
        JSON.stringify({
          lastId: lastId,
          lastCreatedAt: lastCreatedAt,
        }),
      ),
    )
    const limit = 3
    const result = await searchMemos(userId, keyword, cursor, limit)

    expect(result.memos).toEqual(mockMemos)
    expect(result.nextCursor).not.toEqual(null)
    expect(MemoRepository.findByKeyword).toHaveBeenCalledWith(
      userId,
      keyword,
      lastId,
      lastCreatedAt,
      limit,
    )
  })
})
