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
      },
      {
        id: 2,
        bookId: 2,
        content: 'メモ2',
        pageNo: 222,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        bookTitle: 'タイトル2',
      },
      {
        id: 3,
        bookId: 3,
        content: 'メモ3',
        pageNo: null,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        bookTitle: 'タイトル3',
      },
    ]

    vi.mocked(MemoRepository.findByKeyword).mockResolvedValue(mockMemos)

    const userId = '1'
    const keyword = 'メモ'
    const result = await searchMemos(userId, keyword)

    expect(result).toEqual(mockMemos)
    expect(MemoRepository.findByKeyword).toHaveBeenCalledWith(userId, keyword)
  })
})
