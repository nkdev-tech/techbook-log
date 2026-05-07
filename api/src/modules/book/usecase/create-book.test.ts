import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createBook } from './create-book'
import { BookRepository } from '../repository/book-repository'
import { TagRepository } from '../../tag/repository/tag-repository'

vi.mock('../repository/book-repository')
vi.mock('../../tag/repository/tag-repository')
vi.mock('../../tag/repository/tagging-repository')

describe('createBook', () => {
  beforeEach(() => vi.clearAllMocks())

  it('can create book', async () => {
    const userId = '1'
    const data = {
      isbn: '1234567890123',
      title: 'タイトル1',
      author: '著者1',
      publisher: '出版社名',
      thumbnailUrl: 'https://books.google.com/',
      status: 'done' as const,
      rating: 5,
      finishedAt: '2026-01-01',
      tags: [{ name: 'React' }],
    }

    const mockBook = {
      id: 1,
      isbn: '1234567890123',
      title: 'タイトル1',
      author: '著者1',
      publisher: '出版社名',
      thumbnailUrl: 'https://books.google.com/',
      status: 'done' as const,
      rating: 5,
      finishedAt: '2026-01-01',
      userId: '1',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      tags: [{ id: 1, name: 'React', createdAt: '2026-01-01T00:00:00.000Z' }],
    }

    vi.mocked(BookRepository.create).mockResolvedValue(mockBook)
    vi.mocked(BookRepository.findById).mockResolvedValue(mockBook)
    vi.mocked(TagRepository.findOrCreate).mockResolvedValue({
      id: 1,
      name: 'React',
      userId: '1',
      createdAt: '2026-01-01T00:00:00.000Z',
    })

    const result = await createBook(userId, data)

    expect(result).toEqual(mockBook)
    expect(BookRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ finishedAt: '2026-01-01' }),
    )
  })

  it('finishedAt is null when status is not done', async () => {
    const userId = '1'
    const data = {
      isbn: '1234567890123',
      title: 'タイトル1',
      author: '著者1',
      publisher: '出版社名',
      thumbnailUrl: 'https://books.google.com/',
      status: 'unread' as const,
      rating: 3,
      finishedAt: '2026-01-01',
      tags: [{ name: 'React' }],
    }

    const mockBook = {
      id: 1,
      isbn: '1234567890123',
      title: 'タイトル1',
      author: '著者1',
      publisher: '出版社名',
      thumbnailUrl: 'https://books.google.com/',
      status: 'unread' as const,
      rating: 3,
      finishedAt: null,
      userId: '1',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      tags: [{ id: 1, name: 'React', createdAt: '2026-01-01T00:00:00.000Z' }],
    }

    vi.mocked(BookRepository.create).mockResolvedValue(mockBook)
    vi.mocked(BookRepository.findById).mockResolvedValue(mockBook)
    vi.mocked(TagRepository.findOrCreate).mockResolvedValue({
      id: 1,
      name: 'React',
      userId: '1',
      createdAt: '2026-01-01T00:00:00.000Z',
    })

    await createBook(userId, data)

    expect(BookRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ finishedAt: null }),
    )
  })

  it('cannot create book with DB error', async () => {
    const userId = '1'
    const data = {
      isbn: '1234567890123',
      title: 'タイトル1',
      author: '著者1',
      publisher: '出版社名',
      thumbnailUrl: 'https://books.google.com/',
      status: 'unread' as const,
      rating: 3,
      finishedAt: '2026-01-01',
      tags: [{ name: 'React' }],
    }
    vi.mocked(BookRepository.create).mockRejectedValue(new Error('DB error'))

    await expect(createBook(userId, data)).rejects.toThrow('DB error')
    expect(BookRepository.create).toHaveBeenCalledTimes(1)
  })
})
