import { OpenAPIHono } from '@hono/zod-openapi'
import { createRoute } from '@hono/zod-openapi'
import { searchMemosSchema, querySchema, errorResBodySchema } from './schema'
import { AuthVariables } from '../../middleware/auth'
import {
  searchMemos,
  BadRequestError,
} from '../../modules/memo/usecase/search-memos'

const searchMemosRoute = createRoute({
  method: 'get',
  path: '/',
  request: {
    query: querySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: searchMemosSchema,
        },
      },
      description: 'Search memos by keyword across all books',
    },
    400: {
      content: {
        'application/json': {
          schema: errorResBodySchema,
        },
      },
      description: 'Bad Request',
    },
  },
})

const app = new OpenAPIHono<AuthVariables>().openapi(
  searchMemosRoute,
  async (c) => {
    const { q, cursor, limit } = c.req.valid('query')
    const userId = c.get('user').id
    try {
      const result = await searchMemos(userId, q, cursor, limit)
      return c.json(result, 200)
    } catch (err) {
      if (err instanceof BadRequestError) {
        return c.json(
          {
            success: false,
            error: { name: 'BadRequest', message: '不正なデータです' },
          },
          400,
        )
      }
      throw err
    }
  },
)

export default app
