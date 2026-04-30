import { z } from '@hono/zod-openapi'

export const bookSearchResponseSchema = z
  .object({
    isbn: z.string().nullable().openapi({ example: '1234567890123' }),
    title: z.string().openapi({ example: 'タイトル' }),
    author: z.string().openapi({ example: '著者名' }),
    publisher: z.string().nullable().openapi({ example: '出版社名' }),
    thumbnailUrl: z
      .string()
      .nullable()
      .openapi({ example: 'https://books.google.com/' }),
  })
  .array()

export const querySchema = z.object({
  q: z.string().min(1).openapi({ example: 'React' }),
})

export const errorResBodySchema = z.object({
  success: z.boolean(),
  error: z.object({
    name: z.string(),
    message: z.string().openapi({ example: 'Bad Request' }),
  }),
})
