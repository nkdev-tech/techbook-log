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
})
