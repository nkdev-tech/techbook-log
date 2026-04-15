import { OpenAPIHono } from '@hono/zod-openapi'
import { getBook } from '../../modules/book/usecase/get-book'
import { getBooks } from '../../modules/book/usecase/get-books'
import { createBook } from '../../modules/book/usecase/create-book'
import { updateBook } from '../../modules/book/usecase/update-book'
import { deleteBook } from '../../modules/book/usecase/delete-book'
import { createRoute } from '@hono/zod-openapi'
import {
  createBookReqSchema,
  createBookResSchema,
  deleteBookSchema,
  errorResBodySchema,
  getBookSchema,
  getBooksSchema,
  ParamsSchema,
  querySchema,
  updateBookReqSchema,
  updateBookResSchema,
} from './schema'

type Bindings = {
  DB: D1Database
}

const getBooksRoute = createRoute({
  method: 'get',
  path: '/',
  request: {
    query: querySchema,
  },
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
  },
})

const getBookRoute = createRoute({
  method: 'get',
  path: '/{id}',
  request: {
    params: ParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getBookSchema,
        },
      },
      description: 'Retrieve the book',
    },
    404: {
      content: {
        'application/json': {
          schema: errorResBodySchema,
        },
      },
      description: 'Not Found',
    },
  },
})

const updateBookRoute = createRoute({
  method: 'patch',
  path: '/{id}',
  request: {
    params: ParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: updateBookReqSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: updateBookResSchema,
        },
      },
      description: 'Retrieve the book',
    },
    400: {
      content: {
        'application/json': {
          schema: errorResBodySchema,
        },
      },
      description: 'Bad Request',
    },
    404: {
      content: {
        'application/json': {
          schema: errorResBodySchema,
        },
      },
      description: 'Not Found',
    },
  },
})

const deleteBookRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  request: {
    params: ParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: deleteBookSchema,
        },
      },
      description: 'delete the book',
    },
    404: {
      content: {
        'application/json': {
          schema: errorResBodySchema,
        },
      },
      description: 'Not Found',
    },
  },
})

const app = new OpenAPIHono<{ Bindings: Bindings }>()
  .openapi(getBooksRoute, async (c) => {
    const { tags } = c.req.valid('query')
    const tagArray = tags ? tags.split(',').filter(Boolean) : []
    const result = await getBooks(tagArray, c.env.DB)
    return c.json(result, 200)
  })
  .openapi(createBookRoute, async (c) => {
    const data = c.req.valid('json')
    const result = await createBook(data, c.env.DB)
    return c.json(result, 201)
  })
  .openapi(getBookRoute, async (c) => {
    const { id } = c.req.valid('param')
    const result = await getBook(Number(id), c.env.DB)
    if (result === null) {
      return c.json(
        {
          success: false,
          error: { name: 'NotFound', message: 'データが見つかりませんでした' },
        },
        404,
      )
    }
    return c.json(result, 200)
  })
  .openapi(updateBookRoute, async (c) => {
    const { id } = c.req.valid('param')
    const data = c.req.valid('json')
    const result = await updateBook(Number(id), data, c.env.DB)
    if (result === null) {
      return c.json(
        {
          success: false,
          error: { name: 'NotFound', message: 'データが見つかりませんでした' },
        },
        404,
      )
    }
    return c.json(result, 200)
  })
  .openapi(deleteBookRoute, async (c) => {
    const { id } = c.req.valid('param')
    const result = await deleteBook(Number(id), c.env.DB)
    if (result === null) {
      return c.json(
        {
          success: false,
          error: { name: 'NotFound', message: 'データが見つかりませんでした' },
        },
        404,
      )
    }
    return c.json(result, 200)
  })

export default app
