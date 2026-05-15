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
      pageNo: null,
    }

    const mockMemo = {
      id: 1,
      bookId: 1,
      content: 'メモ1',
      pageNo: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }

    vi.mocked(BookRepository.findById).mockResolvedValue({
      id: 1,
      isbn: '1234567890123',
      title: 'タイトル1',
      author: '著者1',
      publisher: '出版社名',
      thumbnailUrl: 'https://books.google.com/',
      status: 'unread' as const,
      rating: 3,
      finishedAt: '2026-01-01',
      userId: '1',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      tags: [{ id: 1, name: 'React' }],
    })
    vi.mocked(MemoRepository.create).mockResolvedValue(mockMemo)

    const userId = '1'
    const result = await createMemo(userId, data)

    expect(result).toEqual(mockMemo)
    expect(MemoRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        bookId: 1,
        content: 'メモ1',
        pageNo: null,
      }),
    )
  })

  it('can create memo with pageNo', async () => {
    const data = {
      bookId: 1,
      content: 'メモ1',
      pageNo: 111,
    }

    const mockMemo = {
      id: 1,
      bookId: 1,
      content: 'メモ1',
      pageNo: 111,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }

    vi.mocked(BookRepository.findById).mockResolvedValue({
      id: 1,
      isbn: '1234567890123',
      title: 'タイトル1',
      author: '著者1',
      publisher: '出版社名',
      thumbnailUrl: 'https://books.google.com/',
      status: 'unread' as const,
      rating: 3,
      finishedAt: '2026-01-01',
      userId: '1',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      tags: [{ id: 1, name: 'React' }],
    })
    vi.mocked(MemoRepository.create).mockResolvedValue(mockMemo)

    const userId = '1'
    const result = await createMemo(userId, data)

    expect(result).toEqual(mockMemo)
    expect(MemoRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        bookId: 1,
        content: 'メモ1',
        pageNo: 111,
      }),
    )
  })

  it('cannot create memo when book does not exist', async () => {
    const data = {
      bookId: 1,
      content: 'メモ1',
      pageNo: null,
    }

    vi.mocked(BookRepository.findById).mockResolvedValue(null)

    const userId = '1'
    const result = await createMemo(userId, data)
    expect(result).toBeNull()
    expect(MemoRepository.create).not.toHaveBeenCalled()
  })
})
