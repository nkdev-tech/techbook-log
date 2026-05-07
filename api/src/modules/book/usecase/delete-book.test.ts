import { beforeEach, describe, expect, it, vi } from 'vitest'
import { deleteBook } from './delete-book'
import { BookRepository } from '../repository/book-repository'

vi.mock('../repository/book-repository')

describe('deleteBook', () => {
  beforeEach(() => vi.clearAllMocks())
  it('can delete book', async () => {
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
    vi.mocked(BookRepository.delete).mockResolvedValue(mockBook)

    const id = 1
    const userId = '1'
    const result = await deleteBook(id, userId)

    expect(result).toEqual(mockBook)
    expect(BookRepository.delete).toHaveBeenCalledTimes(1)
  })

  it('cannot delete book that does not exist', async () => {
    vi.mocked(BookRepository.delete).mockResolvedValue(null)

    const id = 1
    const userId = '1'
    const result = await deleteBook(id, userId)

    expect(result).toBeNull()
    expect(BookRepository.delete).toHaveBeenCalledTimes(1)
  })
})
