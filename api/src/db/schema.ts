import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core'

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

export const tagTable = sqliteTable('tags', {
  id: integer('id').primaryKey(),
  name: text('name').notNull().unique(),
  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
})

export const taggingTable = sqliteTable('taggings', {
  bookId: integer('book_id').notNull().references(() => bookTable.id, { onDelete: 'cascade' }),
  tagId: integer('tag_id').notNull().references(() => tagTable.id, { onDelete: 'cascade' }),
}, (table) => [
  primaryKey({ columns: [table.bookId, table.tagId] }),
])

export const booksRelations = relations(bookTable, ({ many }) => ({
  taggings: many(taggingTable),
}))

export const tagsRelations = relations(tagTable, ({ many }) => ({
  taggings: many(taggingTable),
}))

export const taggingRelations = relations(taggingTable, ({ one }) => ({
  book: one(bookTable, {
    fields: [taggingTable.bookId],
    references: [bookTable.id],
  }),
  tag: one(tagTable, {
    fields: [taggingTable.tagId],
    references: [tagTable.id],
  })
}))
