import { testClient } from 'hono/testing'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import app from '../../src'
import type { AppType } from '../../src'
import { TagRepository } from '../modules/tag/repository/tag-repository'

vi.mock('../modules/tag/repository/tag-repository')
vi.mock('../lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue({ user: { id: '1' } }),
    },
    handler: vi.fn(),
  },
}))

describe('tags', () => {
  beforeEach(() => vi.clearAllMocks())

  const client = testClient<AppType>(app)

  it('can get tags', async () => {
    vi.mocked(TagRepository.findAll).mockResolvedValue([])
    const res = await client.api.tags.$get()
    expect(res.status).toBe(200)
  })
})
