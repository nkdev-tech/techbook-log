import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import {
  createMemoReqSchema,
  createMemoResSchema,
  deleteMemoResSchema,
  errorResBodySchema,
  getMemosSchema,
  memoParamSchema,
  updateMemoReqSchema,
  updateMemoResSchema,
  ParamsSchema,
} from './schema'
import { getMemos } from '../../modules/memo/usecase/get-memos'
import { createMemo } from '../../modules/memo/usecase/create-memo'
import { updateMemo } from '../../modules/memo/usecase/update-memo'
import { deleteMemo } from '../../modules/memo/usecase/delete-memo'

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

const updateMemoRoute = createRoute({
  method: 'patch',
  path: '/{id}/memos/{memoId}',
  request: {
    params: memoParamSchema,
    body: {
      content: {
        'application/json': {
          schema: updateMemoReqSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: updateMemoResSchema,
        },
      },
      description: 'Update a memo',
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

const deleteMemoRoute = createRoute({
  method: 'delete',
  path: '/{id}/memos/{memoId}',
  request: {
    params: memoParamSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: deleteMemoResSchema,
        },
      },
      description: 'Delete a memo',
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

const app = new OpenAPIHono()
  .openapi(getMemosRoute, async (c) => {
    const { id } = c.req.valid('param')
    const result = await getMemos(Number(id))
    return c.json(result, 200)
  })
  .openapi(createMemoRoute, async (c) => {
    const { id } = c.req.valid('param')
    const data = c.req.valid('json')
    const result = await createMemo({ ...data, bookId: Number(id) })
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
  .openapi(updateMemoRoute, async (c) => {
    const { memoId } = c.req.valid('param')
    const data = c.req.valid('json')
    const result = await updateMemo(Number(memoId), data)
    if (result === null) {
      return c.json(
        {
          success: false,
          error: {
            name: 'NotFound',
            message: 'メモが見つかりませんでした',
          },
        },
        404,
      )
    }
    return c.json(result, 200)
  })
  .openapi(deleteMemoRoute, async (c) => {
    const { memoId } = c.req.valid('param')
    const result = await deleteMemo(Number(memoId))
    if (result === null) {
      return c.json(
        {
          success: false,
          error: {
            name: 'NotFound',
            message: 'メモが見つかりませんでした',
          },
        },
        404,
      )
    }
    return c.json(result, 200)
  })

export default app
