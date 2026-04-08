import { testClient } from 'hono/testing'
import { describe, it, expect, vi } from 'vitest'
import app from '../../src'
import type { AppType } from '../../src'
import { BookRepository } from '../../src/modules/book/repository/book-repository'

vi.mock('../../src/modules/book/repository/book-repository')

describe('books', () => {
  const client = testClient<AppType>(app, {
    DB: {} as D1Database,
  })

  it('can get books', async () => {
    vi.mocked(BookRepository.findAll).mockResolvedValue([])
    const res = await client.api.books.$get()
    expect(res.status).toBe(200)
  })

  it('can create book', async () => {
    vi.mocked(BookRepository.create).mockResolvedValue({
      id: 1,
      title: 'タイトル',
      author: '著者名',
      status: 'unread' as const,
      rating: null,
      finishedAt: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    })
    const res = await client.api.books.$post({
      json: {
        title: 'タイトル',
        author: '著者名',
        status: 'unread' as const,
        rating: null,
        finishedAt: null,
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
      },
    })
    expect(res.status).toBe(500)
  })
})
