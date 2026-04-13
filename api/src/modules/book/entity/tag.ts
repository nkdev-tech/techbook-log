import { tagTable } from '../../../db/schema'

export type SelectTag = typeof tagTable.$inferSelect
export type InsertTag = typeof tagTable.$inferInsert
