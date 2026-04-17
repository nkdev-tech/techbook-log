import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createMemo } from './create-memo'
import { BookRepository } from '../../book/repository/book-repository'
import { MemoRepository } from '../repository/memo-repository'

vi.mock('../repository/memo-repository')
vi.mock('../../book/repository/book-repository')

describe('createMemo', () => {
  beforeEach(() => vi.clearAllMocks())

  it('can create memo', async () => {
    const data = {
      bookId: 1,
      content: 'メモ1',
    }

    const mockMemo = {
      id: 1,
      bookId: 1,
      content: 'メモ1',
      createdAt: '2026-01-01T00:00:00.000Z',
    }

    vi.mocked(BookRepository.findById).mockResolvedValue({
      id: 1,
      title: 'タイトル1',
      author: '著者1',
      status: 'unread' as const,
      rating: 3,
      finishedAt: '2026-01-01',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      tags: [{ id: 1, name: 'React', createdAt: '2026-01-01T00:00:00.000Z' }],
    })
    vi.mocked(MemoRepository.create).mockResolvedValue(mockMemo)

    const mockD1 = {} as D1Database
    const result = await createMemo(data, mockD1)

    expect(result).toEqual(mockMemo)
    expect(MemoRepository.create).toHaveBeenCalledTimes(1)
  })

  it('cannot create memo when book does not exist', async () => {
    const data = {
      bookId: 1,
      content: 'メモ1',
    }

    vi.mocked(BookRepository.findById).mockResolvedValue(null)

    const mockD1 = {} as D1Database

    const result = await createMemo(data, mockD1)
    expect(result).toBeNull()
    expect(MemoRepository.create).not.toHaveBeenCalled()
  })
})
