import { OpenAPIHono } from '@hono/zod-openapi'
import { getTags } from '../../modules/tag/usecase/get-tags'
import { getTagsSchema } from './schema'
import { createRoute } from '@hono/zod-openapi'

const getTagsRoute = createRoute({
  method: 'get',
  path: '/',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getTagsSchema,
        },
      },
      description: 'Retrieve tags',
    },
  },
})

const app = new OpenAPIHono().openapi(getTagsRoute, async (c) => {
  const result = await getTags()
  return c.json(result, 200)
})

export default app
