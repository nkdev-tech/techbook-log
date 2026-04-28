import { testClient } from 'hono/testing'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import app from '../../src'
import type { AppType } from '../../src'
import { BookRepository } from '../modules/book/repository/book-repository'
import { TagRepository } from '../modules/tag/repository/tag-repository'

vi.mock('../modules/book/repository/book-repository')
vi.mock('../modules/tag/repository/tag-repository')
vi.mock('../modules/tag/repository/tagging-repository')
vi.mock('../lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue({ user: { id: '1' } }),
    },
    handler: vi.fn(),
  },
}))

describe('books', () => {
  beforeEach(() => vi.clearAllMocks())

  const client = testClient<AppType>(app)

  it('can get books', async () => {
    vi.mocked(BookRepository.findAll).mockResolvedValue([])
    const res = await client.api.books.$get({
      query: { tags: 'React,Next.js' },
    })
    expect(res.status).toBe(200)
  })

  it('can create book', async () => {
    const mockBook = {
      id: 1,
      isbn: '1234567890123',
      title: 'タイトル',
      author: '著者名',
      publisher: '出版社名',
      status: 'unread' as const,
      rating: null,
      finishedAt: null,
      userId: '1',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      tags: [{ id: 1, name: 'React' }],
    }
    vi.mocked(BookRepository.create).mockResolvedValue(mockBook)
    vi.mocked(BookRepository.findById).mockResolvedValue(mockBook)
    vi.mocked(TagRepository.findOrCreate).mockResolvedValue({
      id: 1,
      name: 'React',
      userId: '1',
      createdAt: '2026-01-01T00:00:00.000Z',
    })
    const res = await client.api.books.$post({
      json: {
        isbn: '1234567890123',
        title: 'タイトル',
        author: '著者名',
        publisher: '出版社名',
        status: 'unread' as const,
        rating: null,
        finishedAt: null,
        tags: [{ name: 'React' }],
      },
    })
    expect(res.status).toBe(201)
  })

  it('cannot create book with invalid value', async () => {
    const res = await client.api.books.$post({
      json: {
        isbn: '1234567890123',
        title: '',
        author: '著者名',
        publisher: '出版社名',
        status: 'unread' as const,
        rating: null,
        finishedAt: null,
        tags: [{ name: 'React' }],
      },
    })
    expect(res.status).toBe(400)
  })

  it('cannot create book with DB error', async () => {
    vi.mocked(BookRepository.create).mockRejectedValue(new Error('DB error'))
    const res = await client.api.books.$post({
      json: {
        isbn: '1234567890123',
        title: 'タイトル',
        author: '著者名',
        publisher: '出版社名',
        status: 'unread' as const,
        rating: null,
        finishedAt: null,
        tags: [{ name: 'React' }],
      },
    })
    expect(res.status).toBe(500)
  })

  it('can get book', async () => {
    vi.mocked(BookRepository.findById).mockResolvedValue({
      id: 1,
      isbn: '1234567890123',
      title: 'タイトル',
      author: '著者名',
      publisher: '出版社名',
      status: 'unread' as const,
      rating: null,
      finishedAt: null,
      userId: '1',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      tags: [{ id: 1, name: 'React' }],
    })
    const res = await client.api.books[':id'].$get({ param: { id: '1' } })
    expect(res.status).toBe(200)
  })

  it('cannot get book that does not exist', async () => {
    vi.mocked(BookRepository.findById).mockResolvedValue(null)
    const res = await client.api.books[':id'].$get({ param: { id: '1' } })
    expect(res.status).toBe(404)
  })

  it('can update book', async () => {
    const mockBook = {
      id: 1,
      isbn: '1234567890123',
      title: 'タイトル',
      author: '著者名',
      publisher: '出版社名',
      status: 'unread' as const,
      rating: null,
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
    const res = await client.api.books[':id'].$patch({
      param: { id: '1' },
      json: {
        isbn: '1234567890123',
        title: 'タイトル',
        author: '著者名',
        publisher: '出版社名',
        status: 'unread' as const,
        rating: null,
        finishedAt: null,
        tags: [{ name: 'React' }],
      },
    })
    expect(res.status).toBe(200)
  })

  it('cannot update book with invalid value', async () => {
    const res = await client.api.books[':id'].$patch({
      param: { id: '1' },
      json: {
        isbn: '1234567890123',
        title: '',
        author: '著者名',
        publisher: '出版社名',
        status: 'unread' as const,
        rating: null,
        finishedAt: null,
        tags: [{ name: 'React' }],
      },
    })
    expect(res.status).toBe(400)
  })

  it('cannot update book that does not exist', async () => {
    vi.mocked(BookRepository.update).mockResolvedValue(null)
    const res = await client.api.books[':id'].$patch({
      param: { id: '1' },
      json: {
        isbn: '1234567890123',
        title: 'タイトル',
        author: '著者名',
        publisher: '出版社名',
        status: 'unread' as const,
        rating: null,
        finishedAt: null,
        tags: [{ name: 'React' }],
      },
    })
    expect(res.status).toBe(404)
  })

  it('can delete book', async () => {
    vi.mocked(BookRepository.delete).mockResolvedValue({
      id: 1,
      isbn: '1234567890123',
      title: 'タイトル',
      author: '著者名',
      publisher: '出版社名',
      status: 'unread' as const,
      rating: null,
      finishedAt: null,
      userId: '1',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      tags: [],
    })
    const res = await client.api.books[':id'].$delete({ param: { id: '1' } })
    expect(res.status).toBe(200)
  })

  it('cannot delete book that does not exist', async () => {
    vi.mocked(BookRepository.delete).mockResolvedValue(null)
    const res = await client.api.books[':id'].$delete({ param: { id: '1' } })
    expect(res.status).toBe(404)
  })
})
