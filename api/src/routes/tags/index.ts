import { OpenAPIHono } from '@hono/zod-openapi'
import { getTags } from '../../modules/tag/usecase/get-tags'
import { getTagsSchema } from './schema'
import { createRoute } from '@hono/zod-openapi'
import { AuthVariables } from '../../middleware/auth'

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

const app = new OpenAPIHono<AuthVariables>().openapi(
  getTagsRoute,
  async (c) => {
    const userId = c.get('user').id
    const result = await getTags(userId)
    return c.json(result, 200)
  },
)

export default app
