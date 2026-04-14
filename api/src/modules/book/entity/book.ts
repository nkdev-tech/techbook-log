import { bookTable } from '../../../db/schema'
import { SelectTag } from '../../tag/entity/tag'

export type SelectBook = typeof bookTable.$inferSelect & {
  taggings?: {
    bookId: number
    tagId: number
    tag: SelectTag
  }[]
}

export type Book = typeof bookTable.$inferSelect & {
  tags?: SelectTag[]
}

export type InsertBook = typeof bookTable.$inferInsert & {
  tags?: { name: string }[]
}

export function toBook(raw: SelectBook): Book {
  const { taggings, ...bookData } = raw
  return { ...bookData, tags: taggings?.map((t) => t.tag) ?? [] }
}
