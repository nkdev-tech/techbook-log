import { createSchemaFactory } from 'drizzle-zod'
import { z } from '@hono/zod-openapi'
import { memoTable } from '../../db/schema'

const { createSelectSchema } = createSchemaFactory({
  zodInstance: z,
})

export const memoSearchSchema = createSelectSchema(memoTable, {
  id: (schema) => schema.openapi({ example: 1 }),
  bookId: (schema) => schema.openapi({ example: 1 }),
  content: (schema) => schema.openapi({ example: 'This is a memo.' }),
  pageNo: (schema) => schema.openapi({ example: 111 }),
  createdAt: (schema) =>
    schema.openapi({ example: '2026-01-01T00:00:00.000Z' }),
  updatedAt: (schema) =>
    schema.openapi({ example: '2026-01-01T00:00:00.000Z' }),
})
  .extend({
    bookTitle: z.string().openapi({ example: 'タイトル' }),
    bookThumbnailUrl: z
      .string()
      .nullable()
      .openapi({ example: 'https://books.google.com/' }),
  })
  .array()

export const querySchema = z.object({
  q: z.string().min(1).openapi({ example: 'メモ' }),
})

export const errorResBodySchema = z.object({
  success: z.boolean(),
  error: z.object({
    name: z.string(),
    message: z.string().openapi({ example: 'Bad Request' }),
  }),
})
