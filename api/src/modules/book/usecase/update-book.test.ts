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
      taggings: [
        {
          bookId: 1,
          tagId: 1,
          tag: {
            id: 1,
            name: 'React',
            createdAt: '2026-01-01T00:00:00.000Z',
          },
        },
      ],
    }

    vi.mocked(BookRepository.update).mockResolvedValue(mockBook)
    vi.mocked(BookRepository.findById).mockResolvedValue(mockBook)

    vi.mocked(TagRepository.findOrCreate).mockResolvedValue({
      id: 1,
      name: 'React',
      createdAt: '2026-01-01T00:00:00.000Z',
    })

    const id = 1
    const mockD1 = {} as D1Database
    const result = await updateBook(id, data, mockD1)

    expect(result).toEqual({
      id: 1,
      title: 'タイトル1',
      author: '著者1',
      status: 'done' as const,
      rating: 5,
      finishedAt: '2026-01-01',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      tags: [
        {
          id: 1,
          name: 'React',
          createdAt: '2026-01-01T00:00:00.000Z',
        },
      ],
    })
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
      taggings: [
        {
          bookId: 1,
          tagId: 1,
          tag: {
            id: 1,
            name: 'React',
            createdAt: '2026-01-01T00:00:00.000Z',
          },
        },
      ],
    }

    vi.mocked(BookRepository.update).mockResolvedValue(mockBook)
    vi.mocked(BookRepository.findById).mockResolvedValue(mockBook)

    vi.mocked(TagRepository.findOrCreate).mockResolvedValue({
      id: 1,
      name: 'React',
      createdAt: '2026-01-01T00:00:00.000Z',
    })

    const id = 1
    const mockD1 = {} as D1Database
    const result = await updateBook(id, data, mockD1)
    expect(result).toEqual({
      id: 1,
      title: 'タイトル1',
      author: '著者1',
      status: 'unread' as const,
      rating: 3,
      finishedAt: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      tags: [
        {
          id: 1,
          name: 'React',
          createdAt: '2026-01-01T00:00:00.000Z',
        },
      ],
    })
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
      tags: [
        {
          name: 'React',
        },
      ],
    }

    const id = 1
    const mockD1 = {} as D1Database
    const result = await updateBook(id, data, mockD1)

    expect(result).toBeNull()
    expect(BookRepository.update).toHaveBeenCalledTimes(1)
  })
})
