import { bookTable } from '../../../db/schema'
import { SelectTag } from './tag'

export type SelectBook = typeof bookTable.$inferSelect & {
  taggings?: {
    bookId: number
    tagId: number
    tag: SelectTag
  }[]
}
export type InsertBook = typeof bookTable.$inferInsert & {
  tags?: { name: string }[]
}
