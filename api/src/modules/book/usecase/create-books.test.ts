import { describe, expect, it, vi } from 'vitest'
import { createBook } from './create-book'
import { BookRepository } from '../repository/book-repository'

vi.mock('../repository/book-repository')

describe('createBook', () => {
  it('can create book', async () => {
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
      rating: 3,
      finishedAt: '2026-01-01',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }

    vi.mocked(BookRepository.create).mockResolvedValue(mockBook)

    const mockD1 = {} as D1Database
    const result = await createBook(data, mockD1)

    expect(result).toEqual(mockBook)
    expect(BookRepository.create).toHaveBeenCalledTimes(1)
  })
})
