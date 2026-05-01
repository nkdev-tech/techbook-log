import { testClient } from 'hono/testing'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import app from '../../src'
import type { AppType } from '../../src'
import { MemoRepository } from '../modules/memo/repository/memo-repository'
import { BookRepository } from '../modules/book/repository/book-repository'

vi.mock('../modules/memo/repository/memo-repository')
vi.mock('../modules/book/repository/book-repository')
vi.mock('../lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue({ user: { id: '1' } }),
    },
    handler: vi.fn(),
  },
}))

describe('memos', () => {
  beforeEach(() => vi.clearAllMocks())

  const client = testClient<AppType>(app)

  it('can get memos', async () => {
    vi.mocked(MemoRepository.findByBookId).mockResolvedValue([])
    const res = await client.api.books[':id'].memos.$get({ param: { id: '1' } })
    expect(res.status).toBe(200)
  })

  it('can create memo', async () => {
    const mockMemo = {
      id: 1,
      bookId: 1,
      content: 'メモ1',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }
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
    vi.mocked(MemoRepository.create).mockResolvedValue(mockMemo)
    const res = await client.api.books[':id'].memos.$post({
      param: { id: '1' },
      json: {
        content: 'メモ1',
      },
    })
    expect(res.status).toBe(201)
  })

  it('cannot create memo with invalid value', async () => {
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
    const res = await client.api.books[':id'].memos.$post({
      param: { id: '1' },
      json: {
        content: '',
      },
    })
    expect(res.status).toBe(400)
  })

  it('cannot create memo when book does not exist', async () => {
    vi.mocked(BookRepository.findById).mockResolvedValue(null)
    const res = await client.api.books[':id'].memos.$post({
      param: { id: '1' },
      json: {
        content: 'メモ1',
      },
    })
    expect(res.status).toBe(404)
  })

  it('can update memo', async () => {
    const data = {
      content: 'メモ更新',
    }

    const mockMemo = {
      id: 1,
      bookId: 1,
      content: 'メモ1',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }
    vi.mocked(MemoRepository.findById).mockResolvedValue(mockMemo)
    vi.mocked(MemoRepository.update).mockResolvedValue({ ...mockMemo, ...data })

    const result = await client.api.books[':id'].memos[':memoId'].$patch({
      param: { id: '1', memoId: '1' },
      json: data,
    })

    expect(result.status).toBe(200)
  })

  it('cannot update memo with invalid value', async () => {
    const data = {
      content: '',
    }

    const mockMemo = {
      id: 1,
      bookId: 1,
      content: 'メモ1',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }
    vi.mocked(MemoRepository.findById).mockResolvedValue(mockMemo)

    const result = await client.api.books[':id'].memos[':memoId'].$patch({
      param: { id: '1', memoId: '1' },
      json: data,
    })

    expect(result.status).toBe(400)
  })

  it('cannot update memo when memo does not exist', async () => {
    const data = {
      content: 'メモ更新',
    }
    vi.mocked(MemoRepository.findById).mockResolvedValue(null)

    const result = await client.api.books[':id'].memos[':memoId'].$patch({
      param: { id: '1', memoId: '1' },
      json: data,
    })

    expect(result.status).toBe(404)
  })

  it('can delete memo', async () => {
    const mockMemo = {
      id: 1,
      bookId: 1,
      content: 'メモ1',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }
    vi.mocked(MemoRepository.delete).mockResolvedValue(mockMemo)

    const result = await client.api.books[':id'].memos[':memoId'].$delete({
      param: { id: '1', memoId: '1' },
    })

    expect(result.status).toBe(200)
  })

  it('cannot delete memo when memo does not exist', async () => {
    vi.mocked(MemoRepository.delete).mockResolvedValue(null)

    const result = await client.api.books[':id'].memos[':memoId'].$delete({
      param: { id: '1', memoId: '1' },
    })

    expect(result.status).toBe(404)
  })
})
