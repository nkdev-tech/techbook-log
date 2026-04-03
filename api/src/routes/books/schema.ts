import { createSchemaFactory } from 'drizzle-zod';
import { z } from '@hono/zod-openapi';
import { bookTable } from '../../db/schema';

const { createSelectSchema } = createSchemaFactory({ zodInstance: z });

export const getBooksSchema = createSelectSchema(bookTable, {
  id: (schema) => schema.openapi({ example: 1 }),
  title: (schema) => schema.openapi({ example: 'タイトル' }),
  author: (schema) => schema.openapi({ example: '著者' }),
  status: (schema) => schema.openapi({ example: 'unread' }),
  rating: (schema) => schema.openapi({ example: 3 }),
  finishedAt: (schema) => schema.openapi({ example: '2026-01-01' }),
  createdAt: (schema) => schema.openapi({ example: '2026-01-01T00:00:00.000Z' }),
  updatedAt: (schema) => schema.openapi({ example: '2026-01-01T00:00:00.000Z' }),
}).array();
