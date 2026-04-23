import { describe, expect, it, vi } from 'vitest'
import { getMemos } from './get-memos'
import { MemoRepository } from '../repository/memo-repository'

vi.mock('../repository/memo-repository')

describe('getMemos', () => {
  it('can get memos', async () => {
    const mockMemos = [
      {
        id: 1,
        bookId: 1,
        content: 'メモ1',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 2,
        bookId: 1,
        content: 'メモ2',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 3,
        bookId: 1,
        content: 'メモ3',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    ]

    vi.mocked(MemoRepository.findByBookId).mockResolvedValue(mockMemos)

    const bookId = 1
    const result = await getMemos(bookId)

    expect(result).toEqual(mockMemos)
    expect(MemoRepository.findByBookId).toHaveBeenCalledWith(bookId)
  })
})
