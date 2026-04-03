import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'

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

export default app
