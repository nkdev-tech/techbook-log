import { createSchemaFactory } from 'drizzle-zod'
import { z } from '@hono/zod-openapi'
import { memoTable } from '../../db/schema'

const { createSelectSchema, createInsertSchema } = createSchemaFactory({
  zodInstance: z,
})

const memosSchema = createSelectSchema(memoTable, {
  id: (schema) => schema.openapi({ example: 1 }),
  bookId: (schema) => schema.openapi({ example: 1 }),
  content: (schema) => schema.openapi({ example: 'This is a memo.' }),
  createdAt: (schema) =>
    schema.openapi({ example: '2026-01-01T00:00:00.000Z' }),
})

const inputMemoSchema = createInsertSchema(memoTable, {
  content: (schema) =>
    schema.min(1).max(200).openapi({ example: 'This is a memo.' }),
}).omit({
  id: true,
  bookId: true,
  createdAt: true,
})

export const getMemosSchema = memosSchema.array()

export const createMemoReqSchema = inputMemoSchema

export const createMemoResSchema = memosSchema

export const errorResBodySchema = z.object({
  success: z.boolean(),
  error: z.object({
    name: z.string(),
    message: z.string().openapi({ example: 'Bad Request' }),
  }),
})
