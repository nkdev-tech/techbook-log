import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import books from './routes/books';

const app = new OpenAPIHono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Techbook Log API',
  },
})

app.get('/ui', swaggerUI({ url: '/doc' }))

app.route('/api/books', books);

export default app
