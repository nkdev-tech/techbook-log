import { testClient } from 'hono/testing'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import app from '../../src'
import type { AppType } from '../../src'
import { MemoRepository } from '../modules/memo/repository/memo-repository'

vi.mock('../modules/memo/repository/memo-repository')
vi.mock('../lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue({ user: { id: '1' } }),
    },
    handler: vi.fn(),
  },
}))

describe('memos search', () => {
  beforeEach(() => vi.clearAllMocks())

  const client = testClient<AppType>(app)

  it('can search memos', async () => {
    vi.mocked(MemoRepository.findByKeyword).mockResolvedValue([])
    const res = await client.api.memos.$get({
      query: {
        q: 'メモ',
      },
    })
    expect(res.status).toBe(200)
  })
})
