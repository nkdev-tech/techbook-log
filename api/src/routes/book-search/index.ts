import { OpenAPIHono } from '@hono/zod-openapi'
import { createRoute } from '@hono/zod-openapi'
import {
  bookSearchResponseSchema,
  errorResBodySchema,
  querySchema,
} from './schema'
import { AuthVariables } from '../../middleware/auth'

type GoogleBooksItem = {
  volumeInfo: {
    title: string
    authors?: string[]
    publisher?: string
    industryIdentifiers?: { type: string; identifier: string }[]
    imageLinks?: { thumbnail?: string }
  }
}

type GoogleBooksResponse = {
  items?: GoogleBooksItem[]
}

const bookSearchRoute = createRoute({
  method: 'get',
  path: '/',
  request: {
    query: querySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: bookSearchResponseSchema,
        },
      },
      description: 'Retrieve book info',
    },
    400: {
      content: {
        'application/json': {
          schema: errorResBodySchema,
        },
      },
      description: 'Bad Request',
    },
    500: {
      content: {
        'application/json': {
          schema: errorResBodySchema,
        },
      },
      description: 'Internal Server Error',
    },
  },
})

const app = new OpenAPIHono<AuthVariables>().openapi(
  bookSearchRoute,
  async (c) => {
    const { q } = c.req.valid('query')
    try {
      const result = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}`,
      )
      if (result.status !== 200) {
        return c.json(
          {
            success: false,
            error: {
              name: 'Internal Server Error',
              message: 'サーバーエラーが発生しました',
            },
          },
          500,
        )
      }
      const data = (await result.json()) as GoogleBooksResponse
      const books = (data.items ?? []).map((item) => ({
        title: item.volumeInfo.title,
        author: item.volumeInfo.authors?.join(', ') ?? '',
        publisher: item.volumeInfo.publisher ?? null,
        isbn:
          item.volumeInfo.industryIdentifiers?.find((i) => i.type === 'ISBN_13')
            ?.identifier ?? null,
        thumbnailUrl: item.volumeInfo.imageLinks?.thumbnail ?? null,
      }))
      return c.json(books, 200)
    } catch {
      return c.json(
        {
          success: false,
          error: {
            name: 'Internal Server Error',
            message: 'サーバーエラーが発生しました',
          },
        },
        500,
      )
    }
  },
)

export default app
