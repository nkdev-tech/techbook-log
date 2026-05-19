import { OpenAPIHono } from '@hono/zod-openapi'
import { createRoute } from '@hono/zod-openapi'
import { memoSearchSchema, querySchema } from './schema'
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
  },
})

const app = new OpenAPIHono<AuthVariables>().openapi(
  searchMemosRoute,
  async (c) => {
    const { q } = c.req.valid('query')
    const userId = c.get('user').id
    const result = await searchMemos(userId, q)
    return c.json(result, 200)
  },
)

export default app
