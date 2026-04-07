import { OpenAPIHono } from '@hono/zod-openapi'
import { getBooks } from '../../modules/book/usecase/get-books'
import { createRoute } from '@hono/zod-openapi'
import { getBooksSchema } from './schema'

type Bindings = {
  DB: D1Database
}

const getBooksRoute = createRoute({
  method: 'get',
  path: '/',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getBooksSchema,
        },
      },
      description: 'Retrieve books',
    },
  },
})

const app = new OpenAPIHono<{ Bindings: Bindings }>().openapi(
  getBooksRoute,
  async (c) => {
    const result = await getBooks(c.env.DB)
    return c.json(result, 200)
  },
)

export default app
