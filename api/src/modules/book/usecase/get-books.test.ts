import { describe, expect, it, vi } from 'vitest'
import { getBooks } from './get-books'
import { BookRepository } from '../repository/book-repository'

vi.mock('../repository/book-repository')

describe('getBooks', () => {
  it('can get books', async () => {
    const mockBooks = [
      {
        id: 1,
        title: 'タイトル1',
        author: '著者1',
        status: 'unread' as const,
        rating: 3,
        finishedAt: '2026-01-01',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        tags: [{ id: 1, name: 'React', createdAt: '2026-01-01T00:00:00.000Z' }],
      },
      {
        id: 2,
        title: 'タイトル2',
        author: '著者2',
        status: 'reading' as const,
        rating: 4,
        finishedAt: '2026-01-02',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        tags: [],
      },
      {
        id: 3,
        title: 'タイトル3',
        author: '著者3',
        status: 'done' as const,
        rating: 5,
        finishedAt: '2026-01-03',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        tags: [],
      },
    ]

    vi.mocked(BookRepository.findAll).mockResolvedValue(mockBooks)

    const mockD1 = {} as D1Database
    const result = await getBooks([], mockD1)

    expect(result).toEqual(mockBooks)
    expect(BookRepository.findAll).toHaveBeenCalledWith([], mockD1)
  })

  it('can get books filtered by tags', async () => {
    const mockBooks = [
      {
        id: 1,
        title: 'タイトル1',
        author: '著者1',
        status: 'unread' as const,
        rating: 3,
        finishedAt: '2026-01-01',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        tags: [{ id: 1, name: 'React', createdAt: '2026-01-01T00:00:00.000Z' }],
      },
    ]

    vi.mocked(BookRepository.findAll).mockResolvedValue(mockBooks)

    const mockD1 = {} as D1Database
    const result = await getBooks(['React'], mockD1)

    expect(result).toEqual(mockBooks)
    expect(BookRepository.findAll).toHaveBeenCalledWith(['React'], mockD1)
  })
})
