import { OpenAPIHono } from '@hono/zod-openapi'
import { getBooks } from '../../modules/book/usecase/get-books'
import { createBook } from '../../modules/book/usecase/create-book'
import { createRoute } from '@hono/zod-openapi'
import {
  createBookReqSchema,
  createBookResSchema,
  errorResBodySchema,
  getBooksSchema,
} from './schema'

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

const createBookRoute = createRoute({
  method: 'post',
  path: '/',
  request: {
    body: {
      content: {
        'application/json': {
          schema: createBookReqSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: createBookResSchema,
        },
      },
      description: 'Create a book',
    },
    400: {
      content: {
        'application/json': {
          schema: errorResBodySchema,
        },
      },
      description: 'Bad Request',
    },
    409: {
      content: {
        'application/json': {
          schema: errorResBodySchema,
        },
      },
      description: 'Conflict',
    },
  },
})

const app = new OpenAPIHono<{ Bindings: Bindings }>()
  .openapi(getBooksRoute, async (c) => {
    const result = await getBooks(c.env.DB)
    return c.json(result, 200)
  })
  .openapi(createBookRoute, async (c) => {
    const data = c.req.valid('json')
    const result = await createBook(data, c.env.DB)
    return c.json(result, 201)
  })

export default app
