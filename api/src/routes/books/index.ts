import { OpenAPIHono } from '@hono/zod-openapi'
import { getBooks } from '../../modules/book/usecase/get-books'
import { createRoute } from '@hono/zod-openapi'
import { getBooksSchema } from './schema'

const app = new OpenAPIHono()

 const getBooksRoute = createRoute({
  method: 'get',
  path: "/",
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getBooksSchema,
        },
      },
      description: 'Retrieve the user',
    }
  },
});

app.openapi(getBooksRoute, async (c) => {
  const result = await getBooks();
  return c.json(result, 200)
});

export default app
