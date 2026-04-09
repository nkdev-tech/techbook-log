import { beforeEach, describe, expect, it, vi } from 'vitest'
import { updateBook } from './update-book'
import { BookRepository } from '../repository/book-repository'

vi.mock('../repository/book-repository')

describe('updateBook', () => {
  beforeEach(() => vi.clearAllMocks())
  it('can update book', async () => {
    const data = {
      title: 'タイトル1',
      author: '著者1',
      status: 'done' as const,
      rating: 5,
      finishedAt: '2026-01-01',
    }

    const mockBook = {
      id: 1,
      title: 'タイトル1',
      author: '著者1',
      status: 'reading' as const,
      rating: null,
      finishedAt: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }

    vi.mocked(BookRepository.update).mockResolvedValue(mockBook)

    const id = 1
    const mockD1 = {} as D1Database
    const result = await updateBook(id, data, mockD1)

    expect(result).toEqual(mockBook)
    expect(BookRepository.update).toHaveBeenCalledWith(
      id,
      expect.objectContaining({ finishedAt: '2026-01-01' }),
      mockD1,
    )
  })

  it('finishedAt is null when status is not done', async () => {
    const data = {
      title: 'タイトル1',
      author: '著者1',
      status: 'unread' as const,
      rating: 3,
      finishedAt: '2026-01-01',
    }

    const mockBook = {
      id: 1,
      title: 'タイトル1',
      author: '著者1',
      status: 'unread' as const,
      rating: null,
      finishedAt: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }

    vi.mocked(BookRepository.update).mockResolvedValue(mockBook)

    const id = 1
    const mockD1 = {} as D1Database
    await updateBook(id, data, mockD1)

    expect(BookRepository.update).toHaveBeenCalledWith(
      id,
      expect.objectContaining({ finishedAt: null }),
      mockD1,
    )
  })

  it('cannot update book that does not exist', async () => {
    vi.mocked(BookRepository.update).mockResolvedValue(null)

    const data = {
      title: 'タイトル1',
      author: '著者1',
      status: 'done' as const,
      rating: 3,
      finishedAt: '2026-01-01',
    }

    const id = 1
    const mockD1 = {} as D1Database
    const result = await updateBook(id, data, mockD1)

    expect(result).toBeNull()
    expect(BookRepository.update).toHaveBeenCalledTimes(1)
  })
})
