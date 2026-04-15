import { testClient } from 'hono/testing'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import app from '../../src'
import type { AppType } from '../../src'
import { TagRepository } from '../modules/tag/repository/tag-repository'

vi.mock('../modules/tag/repository/tag-repository')

describe('tags', () => {
  beforeEach(() => vi.clearAllMocks())

  const client = testClient<AppType>(app, {
    DB: {} as D1Database,
  })

  it('can get tags', async () => {
    vi.mocked(TagRepository.findAll).mockResolvedValue([])
    const res = await client.api.tags.$get()
    expect(res.status).toBe(200)
  })
})
