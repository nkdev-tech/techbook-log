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
    const json = await res.json()
    expect(json).toEqual({ memos: [], nextCursor: null })
  })

  it('can search memos with cursor', async () => {
    vi.mocked(MemoRepository.findByKeyword).mockResolvedValue([])
    const res = await client.api.memos.$get({
      query: {
        q: 'メモ',
        cursor:
          'JTdCJTIybGFzdElkJTIyJTNBMSUyQyUyMmxhc3RDcmVhdGVkQXQlMjIlM0ElMjIyMDI2LTAxLTAxVDAwJTNBMDAlM0EwMC4wMDBaJTIyJTdE',
        limit: 20,
      },
    })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toEqual({ memos: [], nextCursor: null })
  })

  it('cannot search memos with invalid keyword', async () => {
    const res = await client.api.memos.$get({
      query: {
        q: '',
      },
    })
    expect(res.status).toBe(400)
  })

  it('cannot search memos with invalid cursor', async () => {
    const res = await client.api.memos.$get({
      query: {
        q: 'メモ',
        cursor: 'invalid-cursor',
        limit: 20,
      },
    })
    expect(res.status).toBe(400)
  })
})
