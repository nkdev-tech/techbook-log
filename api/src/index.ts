import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import books from './routes/books'
import memos from './routes/memos'
import tags from './routes/tags'
import { cors } from 'hono/cors'
import { auth } from './lib/auth'
import { authMiddleware } from './middleware/auth'
import { except } from 'hono/combine'
import { env } from 'cloudflare:workers'

const app = new OpenAPIHono()

app.use('/*', cors())
app.use('/*', except(['/api/auth/**', '/doc', '/ui'], authMiddleware))

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

if (env.ENV === 'development') {
  app.doc('/doc', {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Techbook Log API',
    },
  })

  app.get('/ui', swaggerUI({ url: '/doc' }))
}

const _route = app
  .route('/api/books', books)
  .route('/api/books', memos)
  .route('/api/tags', tags)

export type AppType = typeof _route

app.on(['POST', 'GET'], '/api/auth/**', (c) => auth.handler(c.req.raw))

export default app
