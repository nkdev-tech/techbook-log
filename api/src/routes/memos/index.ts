import { OpenAPIHono } from '@hono/zod-openapi'
import { getMemos } from '../../modules/memo/usecase/get-memos'
import { createMemo } from '../../modules/memo/usecase/create-memo'
import { createRoute } from '@hono/zod-openapi'
import {
  createMemoReqSchema,
  createMemoResSchema,
  errorResBodySchema,
  getMemosSchema,
  ParamsSchema,
} from './schema'

type Bindings = {
  DB: D1Database
}

const getMemosRoute = createRoute({
  method: 'get',
  path: '/{id}/memos',
  request: {
    params: ParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getMemosSchema,
        },
      },
      description: 'Retrieve memos',
    },
  },
})

const createMemoRoute = createRoute({
  method: 'post',
  path: '/{id}/memos',
  request: {
    params: ParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: createMemoReqSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: createMemoResSchema,
        },
      },
      description: 'Create a memo',
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
  .openapi(getMemosRoute, async (c) => {
    const bookId = Number(c.req.param('id'))
    const result = await getMemos(bookId, c.env.DB)
    return c.json(result, 200)
  })
  .openapi(createMemoRoute, async (c) => {
    const bookId = Number(c.req.param('id'))
    const data = c.req.valid('json')
    const result = await createMemo({ ...data, bookId }, c.env.DB)
    if (result === null) {
      return c.json(
        {
          success: false,
          error: {
            name: 'NotFound',
            message: '関連する本が見つかりませんでした',
          },
        },
        404,
      )
    }
    return c.json(result, 201)
  })

export default app
