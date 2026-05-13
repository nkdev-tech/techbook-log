import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getBooks } from './get-books'
import { BookRepository } from '../repository/book-repository'

vi.mock('../repository/book-repository')

describe('getBooks', () => {
  beforeEach(() => vi.clearAllMocks())

  it('can get books', async () => {
    const mockBooks = [
      {
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
      },
      {
        id: 2,
        isbn: '2345678901234',
        title: 'タイトル2',
        author: '著者2',
        publisher: '出版社名',
        thumbnailUrl: 'https://books.google.com/',
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
        thumbnailUrl: 'https://books.google.com/',
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
    const tags = [] as string[]
    const status = undefined
    const sortBy = undefined
    const order = undefined
    const cursor = undefined
    const limit = undefined
    const result = await getBooks(
      userId,
      tags,
      status,
      sortBy,
      order,
      cursor,
      limit,
    )

    expect(result).toEqual({ books: mockBooks, nextCursor: null })
    expect(BookRepository.findAll).toHaveBeenCalledWith(
      userId,
      tags,
      status,
      sortBy,
      order,
      undefined,
      undefined,
      undefined,
      undefined,
      limit,
    )
  })

  it('can get books filtered by tags', async () => {
    const mockBooks = [
      {
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
      },
    ]

    vi.mocked(BookRepository.findAll).mockResolvedValue(mockBooks)

    const userId = '1'
    const tags = ['React']
    const status = undefined
    const sortBy = undefined
    const order = undefined
    const cursor = undefined
    const limit = undefined
    const result = await getBooks(
      userId,
      tags,
      status,
      sortBy,
      order,
      cursor,
      limit,
    )

    expect(result).toEqual({ books: mockBooks, nextCursor: null })
    expect(BookRepository.findAll).toHaveBeenCalledWith(
      userId,
      tags,
      status,
      sortBy,
      order,
      undefined,
      undefined,
      undefined,
      undefined,
      limit,
    )
  })

  it('can get books filtered by status', async () => {
    const mockBooks = [
      {
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
      },
    ]

    vi.mocked(BookRepository.findAll).mockResolvedValue(mockBooks)

    const userId = '1'
    const tags = [] as string[]
    const status = 'unread'
    const sortBy = undefined
    const order = undefined
    const cursor = undefined
    const limit = undefined
    const result = await getBooks(
      userId,
      tags,
      status,
      sortBy,
      order,
      cursor,
      limit,
    )

    expect(result).toEqual({ books: mockBooks, nextCursor: null })
    expect(BookRepository.findAll).toHaveBeenCalledWith(
      userId,
      tags,
      status,
      sortBy,
      order,
      undefined,
      undefined,
      undefined,
      undefined,
      limit,
    )
  })

  it('can get books sorted by title', async () => {
    const mockBooks = [
      {
        id: 2,
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
      },
      {
        id: 3,
        isbn: '2345678901234',
        title: 'タイトル2',
        author: '著者2',
        publisher: '出版社名',
        thumbnailUrl: 'https://books.google.com/',
        status: 'reading' as const,
        rating: 4,
        finishedAt: '2026-01-02',
        userId: '1',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        tags: [],
      },
      {
        id: 1,
        isbn: '3456789012345',
        title: 'タイトル3',
        author: '著者3',
        publisher: '出版社名',
        thumbnailUrl: 'https://books.google.com/',
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
    const tags = [] as string[]
    const status = undefined
    const sortBy = 'title'
    const order = 'asc'
    const cursor = undefined
    const limit = undefined
    const result = await getBooks(
      userId,
      tags,
      status,
      sortBy,
      order,
      cursor,
      limit,
    )

    expect(result).toEqual({ books: mockBooks, nextCursor: null })
    expect(BookRepository.findAll).toHaveBeenCalledWith(
      userId,
      tags,
      status,
      sortBy,
      order,
      undefined,
      undefined,
      undefined,
      undefined,
      limit,
    )
  })

  it('returns nextCursor when result count equals limit', async () => {
    const mockBooks = [
      {
        id: 4,
        isbn: '1234567890123',
        title: 'タイトル4',
        author: '著者4',
        publisher: '出版社名',
        thumbnailUrl: 'https://books.google.com/',
        status: 'unread' as const,
        rating: 3,
        finishedAt: '2026-01-01',
        userId: '1',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        tags: [{ id: 1, name: 'React' }],
      },
      {
        id: 5,
        isbn: '2345678901234',
        title: 'タイトル5',
        author: '著者5',
        publisher: '出版社名',
        thumbnailUrl: 'https://books.google.com/',
        status: 'reading' as const,
        rating: 4,
        finishedAt: '2026-01-02',
        userId: '1',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        tags: [],
      },
      {
        id: 6,
        isbn: '3456789012345',
        title: 'タイトル6',
        author: '著者6',
        publisher: '出版社名',
        thumbnailUrl: 'https://books.google.com/',
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
    const tags = [] as string[]
    const status = undefined
    const sortBy = undefined
    const order = undefined
    const lastId = '3'
    const lastCreatedAt = '2026-01-01T00:00:00.000Z'
    const lastTitle = 'タイトル3'
    const lastRating = 3
    const cursor = btoa(
      encodeURIComponent(
        JSON.stringify({
          lastId: lastId,
          lastCreatedAt: lastCreatedAt,
          lastTitle: lastTitle,
          lastRating: lastRating,
        }),
      ),
    )
    const limit = 3
    const result = await getBooks(
      userId,
      tags,
      status,
      sortBy,
      order,
      cursor,
      limit,
    )

    expect(result.books).toEqual(mockBooks)
    expect(result.nextCursor).not.toBeNull()
    expect(BookRepository.findAll).toHaveBeenCalledWith(
      userId,
      tags,
      status,
      sortBy,
      order,
      lastId,
      lastCreatedAt,
      lastTitle,
      lastRating,
      limit,
    )
  })
})
