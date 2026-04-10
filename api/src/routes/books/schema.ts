import { createSchemaFactory } from 'drizzle-zod'
import { z } from '@hono/zod-openapi'
import { bookTable } from '../../db/schema'

const { createInsertSchema, createSelectSchema } = createSchemaFactory({
  zodInstance: z,
})

const booksSchema = createSelectSchema(bookTable, {
  id: (schema) => schema.openapi({ example: 1 }),
  title: (schema) => schema.openapi({ example: 'タイトル' }),
  author: (schema) => schema.openapi({ example: '著者名' }),
  status: (schema) => schema.openapi({ example: 'unread' }),
  rating: (schema) => schema.openapi({ example: 3 }),
  finishedAt: (schema) => schema.openapi({ example: '2026-01-01' }),
  createdAt: (schema) =>
    schema.openapi({ example: '2026-01-01T00:00:00.000Z' }),
  updatedAt: (schema) =>
    schema.openapi({ example: '2026-01-01T00:00:00.000Z' }),
})

const inputBookSchema = createInsertSchema(bookTable, {
  title: (schema) =>
    schema
      .min(1, 'タイトルを入力してください')
      .max(100, 'タイトルは100文字以内で入力してください')
      .openapi({ example: 'タイトル' }),
  author: (schema) =>
    schema
      .max(100, '著者名は100文字以内で入力してください')
      .openapi({ example: '著者名' }),
  status: (schema) => schema.openapi({ example: 'unread' }),
  rating: (schema) => schema.min(1).max(5).openapi({ example: 3 }),
  finishedAt: (schema) => schema.openapi({ example: '2026-01-01' }),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const getBooksSchema = booksSchema.array()

export const createBookReqSchema = inputBookSchema

export const createBookResSchema = booksSchema

export const getBookSchema = booksSchema

export const updateBookReqSchema = inputBookSchema

export const updateBookResSchema = booksSchema

export const deleteBookSchema = booksSchema

export const ParamsSchema = z.object({
  id: z
    .string()
    .min(1)
    .openapi({
      param: {
        name: 'id',
        in: 'path',
      },
      example: '1',
    }),
})

export const errorResBodySchema = z.object({
  success: z.boolean(),
  error: z.object({
    name: z.string(),
    message: z.string().openapi({ example: 'Bad Request' }),
  }),
})
