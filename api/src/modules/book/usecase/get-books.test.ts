import { describe, expect, it, vi } from 'vitest'
import { getBooks } from './get-books'
import { BookRepository } from '../repository/book-repository'

vi.mock('../repository/book-repository')

describe('getBooks', () => {
  it('can get books', async () => {
    const mockBooks = [
      {
        id: 1,
        isbn: '1234567890123',
        title: 'タイトル1',
        author: '著者1',
        publisher: '出版社名',
        status: 'unread' as const,
        rating: 3,
        finishedAt: '2026-01-01',
        userId: '1',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        tags: [{ id: 1, name: 'React' }],
      },
      {
        id: 2,
        isbn: '2345678901234',
        title: 'タイトル2',
        author: '著者2',
        publisher: '出版社名',
        status: 'reading' as const,
        rating: 4,
        finishedAt: '2026-01-02',
        userId: '1',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        tags: [],
      },
      {
        id: 3,
        isbn: '3456789012345',
        title: 'タイトル3',
        author: '著者3',
        publisher: '出版社名',
        status: 'done' as const,
        rating: 5,
        finishedAt: '2026-01-03',
        userId: '1',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        tags: [],
      },
    ]

    vi.mocked(BookRepository.findAll).mockResolvedValue(mockBooks)

    const userId = '1'
    const result = await getBooks(userId, [])

    expect(result).toEqual(mockBooks)
    expect(BookRepository.findAll).toHaveBeenCalledWith(userId, [])
  })

  it('can get books filtered by tags', async () => {
    const mockBooks = [
      {
        id: 1,
        isbn: '1234567890123',
        title: 'タイトル1',
        author: '著者1',
        publisher: '出版社名',
        status: 'unread' as const,
        rating: 3,
        finishedAt: '2026-01-01',
        userId: '1',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        tags: [{ id: 1, name: 'React' }],
      },
    ]

    vi.mocked(BookRepository.findAll).mockResolvedValue(mockBooks)

    const userId = '1'
    const result = await getBooks(userId, ['React'])

    expect(result).toEqual(mockBooks)
    expect(BookRepository.findAll).toHaveBeenCalledWith(userId, ['React'])
  })
})
