import { testClient } from 'hono/testing'
import { describe, it, expect, vi } from 'vitest'
import app from '../../src'
import type { AppType } from '../../src'

vi.mock('../lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue({ user: { id: '1' } }),
    },
    handler: vi.fn(),
  },
}))

describe('book-search', () => {
  const client = testClient<AppType>(app)

  it('can get book info', async () => {
    const mockData = {
      items: [
        {
          id: '_ojXNuzgHRcC',
          volumeInfo: {
            title:
              '改訂新版 これからはじめるReact実践入門　コンポーネントの基本からNext.jsによるアプリ開発まで',
            author: ['山田祥寛'],
            publisher: 'SBクリエイティブ',
            industryIdentifiers: [
              {
                type: 'ISBN_13',
                identifier: '9780553804577',
              },
            ],
            imageLinks: {
              thumbnail: 'thumbnail-url',
            },
          },
        },
        {
          id: 'zyTCAlFPjgYC',
          volumeInfo: {
            title: '実践Next.js —— App Routerで進化するWebアプリ開発',
            author: ['吉井健文'],
            publisher: '技術評論社',
            industryIdentifiers: [
              {
                type: 'ISBN_13',
                identifier: '9780553804577',
              },
            ],
            imageLinks: {
              thumbnail: 'thumbnail-url',
            },
          },
        },
        {
          id: 'AZ5J6B1-4BoC',
          volumeInfo: {
            title:
              'TypeScriptとReact/Next.jsでつくる実践Webアプリケーション開発',
            author: ['手島 拓也', '吉田健人', '高林佳稀'],
            publisher: '技術評論社',
            industryIdentifiers: [
              {
                type: 'ISBN_13',
                identifier: '9780553804577',
              },
            ],
            imageLinks: {
              thumbnail: 'thumbnail-url',
            },
          },
        },
      ],
    }
    const spy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify(mockData)))

    const res = await client.api['book-search'].$get({
      query: { q: 'Next.js' },
    })
    expect(res.status).toBe(200)

    spy.mockRestore()
  })

  it('cannot get book info with invalid value', async () => {
    const res = await client.api['book-search'].$get({
      query: { q: '' },
    })
    expect(res.status).toBe(400)
  })

  it('cannot get book info with api error', async () => {
    const spy = vi
      .spyOn(globalThis, 'fetch')
      .mockRejectedValue(new Error('API error'))

    const res = await client.api['book-search'].$get({
      query: { q: 'Next.js' },
    })
    expect(res.status).toBe(500)

    spy.mockRestore()
  })
})
