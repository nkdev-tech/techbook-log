import { beforeEach, describe, expect, it, vi } from 'vitest'
import { updateBook } from './update-book'
import { BookRepository } from '../repository/book-repository'
import { TagRepository } from '../../tag/repository/tag-repository'

vi.mock('../repository/book-repository')
vi.mock('../../tag/repository/tag-repository')
vi.mock('../../tag/repository/tagging-repository')

describe('updateBook', () => {
  beforeEach(() => vi.clearAllMocks())

  it('can update book', async () => {
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
      tags: [{ id: 1, name: 'React' }],
    }

    vi.mocked(BookRepository.update).mockResolvedValue(mockBook)
    vi.mocked(BookRepository.findById).mockResolvedValue(mockBook)
    vi.mocked(TagRepository.findOrCreate).mockResolvedValue({
      id: 1,
      name: 'React',
      userId: '1',
      createdAt: '2026-01-01T00:00:00.000Z',
    })

    const id = 1
    const userId = '1'
    const result = await updateBook(id, userId, data)

    expect(result).toEqual(mockBook)
    expect(BookRepository.update).toHaveBeenCalledWith(
      id,
      expect.objectContaining({ finishedAt: '2026-01-01' }),
    )
  })

  it('finishedAt is null when status is not done', async () => {
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
      tags: [{ id: 1, name: 'React' }],
    }

    vi.mocked(BookRepository.update).mockResolvedValue(mockBook)
    vi.mocked(BookRepository.findById).mockResolvedValue(mockBook)
    vi.mocked(TagRepository.findOrCreate).mockResolvedValue({
      id: 1,
      name: 'React',
      userId: '1',
      createdAt: '2026-01-01T00:00:00.000Z',
    })

    const id = 1
    const userId = '1'
    await updateBook(id, userId, data)

    expect(BookRepository.update).toHaveBeenCalledWith(
      id,
      expect.objectContaining({ finishedAt: null }),
    )
  })

  it('cannot update book that does not exist', async () => {
    vi.mocked(BookRepository.update).mockResolvedValue(null)

    const data = {
      isbn: '1234567890123',
      title: 'タイトル1',
      author: '著者1',
      publisher: '出版社名',
      thumbnailUrl: 'https://books.google.com/',
      status: 'done' as const,
      rating: 3,
      finishedAt: '2026-01-01',
      tags: [{ name: 'React' }],
    }

    const id = 1
    const userId = '1'
    const result = await updateBook(id, userId, data)

    expect(result).toBeNull()
    expect(BookRepository.update).toHaveBeenCalledTimes(1)
  })
})
