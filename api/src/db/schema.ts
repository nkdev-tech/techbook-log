import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const bookTable = sqliteTable('books', {
  id: integer('id').primaryKey(),
  title: text('title').notNull(),
  author: text('author').notNull(),
  status: text('status', { enum: ['unread', 'reading', 'done'] })
    .notNull()
    .default('unread'),
  rating: integer('rating'),
  finishedAt: text('finished_at'),
  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
})
