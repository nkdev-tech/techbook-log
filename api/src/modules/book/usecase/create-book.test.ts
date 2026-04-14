import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createBook } from './create-book'
import { BookRepository } from '../repository/book-repository'
import { TagRepository } from '../repository/tag-repository'

vi.mock('../repository/book-repository')
vi.mock('../repository/tag-repository')
vi.mock('../repository/tagging-repository')

describe('createBook', () => {
  beforeEach(() => vi.clearAllMocks())
  it('can create book', async () => {
    const data = {
      title: 'タイトル1',
      author: '著者1',
      status: 'done' as const,
      rating: 5,
      finishedAt: '2026-01-01',
      tags: [
        {
          name: 'React',
        },
      ],
    }

    const mockBook = {
      id: 1,
      title: 'タイトル1',
      author: '著者1',
      status: 'done' as const,
      rating: 5,
      finishedAt: '2026-01-01',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      taggings: [{
        bookId: 1,
        tagId: 1,
        tag: {
          id: 1,
          name: 'React',
          createdAt: '2026-01-01T00:00:00.000Z',
        },
      }],
    }

    vi.mocked(BookRepository.create).mockResolvedValue(mockBook)
    vi.mocked(BookRepository.findById).mockResolvedValue(mockBook)

    vi.mocked(TagRepository.findOrCreate).mockResolvedValue({
      id: 1,
      name: 'React',
      createdAt: '2026-01-01T00:00:00.000Z',
    })

    const mockD1 = {} as D1Database
    const result = await createBook(data, mockD1)

    expect(result).toEqual({
      id: 1,
      title: 'タイトル1',
      author: '著者1',
      status: 'done' as const,
      rating: 5,
      finishedAt: '2026-01-01',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      tags: [{
        id: 1,
        name: 'React',
        createdAt: '2026-01-01T00:00:00.000Z',
      }],
    })
    expect(BookRepository.create).toHaveBeenCalledWith(
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
      tags: [
        {
          name: 'React',
        },
      ],
    }

    const mockBook = {
      id: 1,
      title: 'タイトル1',
      author: '著者1',
      status: 'unread' as const,
      rating: 3,
      finishedAt: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      taggings: [{
        bookId: 1,
        tagId: 1,
        tag: {
          id: 1,
          name: 'React',
          createdAt: '2026-01-01T00:00:00.000Z',
        },
      }],
    }

    vi.mocked(BookRepository.create).mockResolvedValue(mockBook)
    vi.mocked(BookRepository.findById).mockResolvedValue(mockBook)

    vi.mocked(TagRepository.findOrCreate).mockResolvedValue({
      id: 1,
      name: 'React',
      createdAt: '2026-01-01T00:00:00.000Z',
    })

    const mockD1 = {} as D1Database
    const result = await createBook(data, mockD1)

    expect(result).toEqual({
      id: 1,
      title: 'タイトル1',
      author: '著者1',
      status: 'unread' as const,
      rating: 3,
      finishedAt: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      tags: [{
        id: 1,
        name: 'React',
        createdAt: '2026-01-01T00:00:00.000Z',
      }],
    })

    expect(BookRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ finishedAt: null }),
      mockD1,
    )
  })

  it('cannot create book with DB error', async () => {
    const data = {
      title: 'タイトル1',
      author: '著者1',
      status: 'unread' as const,
      rating: 3,
      finishedAt: '2026-01-01',
      tags: [
        {
          name: 'React',
        },
      ],
    }
    const mockD1 = {} as D1Database
    vi.mocked(BookRepository.create).mockRejectedValue(new Error('DB error'))

    await expect(createBook(data, mockD1)).rejects.toThrow('DB error')
    expect(BookRepository.create).toHaveBeenCalledTimes(1)
  })
})
