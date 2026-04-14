import { createSchemaFactory } from 'drizzle-zod'
import { z } from '@hono/zod-openapi'
import { tagTable } from '../../db/schema'

const { createInsertSchema, createSelectSchema } = createSchemaFactory({
  zodInstance: z,
})

const tagsSchema = createSelectSchema(tagTable, {
  id: (schema) => schema.openapi({ example: 1 }),
  name: (schema) => schema.openapi({ example: 'Typescript' }),
  createdAt: (schema) =>
    schema.openapi({ example: '2026-01-01T00:00:00.000Z' }),
})

export const getTagsSchema = tagsSchema.array()
