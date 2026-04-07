import { bookTable } from '../../../db/schema'

export type SelectBook = typeof bookTable.$inferSelect
export type InsertBook = typeof bookTable.$inferInsert
