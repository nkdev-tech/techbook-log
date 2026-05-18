import { OpenAPIHono } from '@hono/zod-openapi'
import { createRoute } from '@hono/zod-openapi'
import { memoSearchSchema, errorResBodySchema, querySchema } from './schema'
import { AuthVariables } from '../../middleware/auth'
import { searchMemos } from '../../modules/memo/usecase/search-memos'

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
          schema: memoSearchSchema,
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
    const { q } = c.req.valid('query')
    const userId = c.get('user').id
    try {
      const result = await searchMemos(userId, q)
      return c.json(result, 200)
    } catch {
      return c.json(
        {
          success: false,
          error: { name: 'BadRequest', message: '不正なデータです' },
        },
        400,
      )
    }
  },
)

export default app
