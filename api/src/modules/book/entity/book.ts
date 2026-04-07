import { bookTable } from '../../../db/schema'

export type Book = typeof bookTable.$inferSelect
