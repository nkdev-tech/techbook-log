import { relations, sql } from 'drizzle-orm'
import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core'

// Auth Schema

export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' })
    .default(false)
    .notNull(),
  image: text('image'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export const session = sqliteTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
    token: text('token').notNull().unique(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  (table) => [index('session_userId_idx').on(table.userId)],
)

export const account = sqliteTable(
  'account',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: integer('access_token_expires_at', {
      mode: 'timestamp_ms',
    }),
    refreshTokenExpiresAt: integer('refresh_token_expires_at', {
      mode: 'timestamp_ms',
    }),
    scope: text('scope'),
    password: text('password'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index('account_userId_idx').on(table.userId)],
)

export const verification = sqliteTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)],
)

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}))

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}))

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}))

// App Schema

export const bookTable = sqliteTable('books', {
  id: integer('id').primaryKey(),
  isbn: text('isbn'),
  title: text('title').notNull(),
  author: text('author').notNull(),
  publisher: text('publisher'),
  status: text('status', { enum: ['unread', 'reading', 'done'] })
    .notNull()
    .default('unread'),
  rating: integer('rating'),
  finishedAt: text('finished_at'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
})

export const tagTable = sqliteTable(
  'tags',
  {
    id: integer('id').primaryKey(),
    name: text('name').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    createdAt: text('created_at')
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
  },
  (table) => [uniqueIndex('tag_name_userId_idx').on(table.name, table.userId)],
)

export const taggingTable = sqliteTable(
  'taggings',
  {
    bookId: integer('book_id')
      .notNull()
      .references(() => bookTable.id, { onDelete: 'cascade' }),
    tagId: integer('tag_id')
      .notNull()
      .references(() => tagTable.id, { onDelete: 'cascade' }),
    order: integer('order').notNull().default(0),
  },
  (table) => [primaryKey({ columns: [table.bookId, table.tagId] })],
)

export const memoTable = sqliteTable('memos', {
  id: integer('id').primaryKey(),
  bookId: integer('book_id')
    .notNull()
    .references(() => bookTable.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
})

export const booksRelations = relations(bookTable, ({ many }) => ({
  taggings: many(taggingTable),
  memos: many(memoTable),
}))

export const tagsRelations = relations(tagTable, ({ many }) => ({
  taggings: many(taggingTable),
}))

export const memosRelations = relations(memoTable, ({ one }) => ({
  book: one(bookTable, {
    fields: [memoTable.bookId],
    references: [bookTable.id],
  }),
}))

export const taggingRelations = relations(taggingTable, ({ one }) => ({
  book: one(bookTable, {
    fields: [taggingTable.bookId],
    references: [bookTable.id],
  }),
  tag: one(tagTable, {
    fields: [taggingTable.tagId],
    references: [tagTable.id],
  }),
}))
