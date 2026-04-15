import { testClient } from 'hono/testing'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import app from '../../src'
import type { AppType } from '../../src'
import { BookRepository } from '../modules/book/repository/book-repository'
import { TagRepository } from '../modules/tag/repository/tag-repository'

vi.mock('../modules/book/repository/book-repository')
vi.mock('../modules/tag/repository/tag-repository')
vi.mock('../modules/tag/repository/tagging-repository')

describe('books', () => {
  beforeEach(() => vi.clearAllMocks())

  const client = testClient<AppType>(app, {
    DB: {} as D1Database,
  })

  it('can get books', async () => {
    vi.mocked(BookRepository.findAll).mockResolvedValue([])
    const res = await client.api.books.$get()
    expect(res.status).toBe(200)
  })

  it('can create book', async () => {
    const mockBook = {
      id: 1,
      title: 'タイトル',
      author: '著者名',
      status: 'unread' as const,
      rating: null,
      finishedAt: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      tags: [{ id: 1, name: 'React', createdAt: '2026-01-01T00:00:00.000Z' }],
    }
    vi.mocked(BookRepository.create).mockResolvedValue(mockBook)
    vi.mocked(BookRepository.findById).mockResolvedValue(mockBook)
    vi.mocked(TagRepository.findOrCreate).mockResolvedValue({
      id: 1,
      name: 'React',
      createdAt: '2026-01-01T00:00:00.000Z',
    })
    const res = await client.api.books.$post({
      json: {
        title: 'タイトル',
        author: '著者名',
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
        title: '',
        author: '著者名',
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
        title: 'タイトル',
        author: '著者名',
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
      title: 'タイトル',
      author: '著者名',
      status: 'unread' as const,
      rating: null,
      finishedAt: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      tags: [{ id: 1, name: 'React', createdAt: '2026-01-01T00:00:00.000Z' }],
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
      title: 'タイトル',
      author: '著者名',
      status: 'unread' as const,
      rating: null,
      finishedAt: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      tags: [{ id: 1, name: 'React', createdAt: '2026-01-01T00:00:00.000Z' }],
    }
    vi.mocked(BookRepository.update).mockResolvedValue(mockBook)
    vi.mocked(BookRepository.findById).mockResolvedValue(mockBook)
    vi.mocked(TagRepository.findOrCreate).mockResolvedValue({
      id: 1,
      name: 'React',
      createdAt: '2026-01-01T00:00:00.000Z',
    })
    const res = await client.api.books[':id'].$patch({
      param: { id: '1' },
      json: {
        title: 'タイトル',
        author: '著者名',
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
        title: '',
        author: '著者名',
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
        title: 'タイトル',
        author: '著者名',
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
      title: 'タイトル',
      author: '著者名',
      status: 'unread' as const,
      rating: null,
      finishedAt: null,
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
