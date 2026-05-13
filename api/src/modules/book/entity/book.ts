import { bookTable } from '../../../db/schema'
import { SelectTag } from '../../tag/entity/tag'

type SelectBook = typeof bookTable.$inferSelect & {
  taggings?: {
    bookId: number
    tagId: number
    tag: SelectTag
  }[]
}

export type Book = typeof bookTable.$inferSelect & {
  tags: { id: number; name: string }[]
}

export type InsertBook = typeof bookTable.$inferInsert & {
  tags?: { name: string }[]
}

export function toBook(raw: SelectBook): Book {
  const { taggings, ...bookData } = raw
  return {
    ...bookData,
    tags: taggings?.map((t) => ({ id: t.tag.id, name: t.tag.name })) ?? [],
  }
}

export type BookSortBy = 'createdAt' | 'title' | 'rating'
export type BookSortOrder = 'asc' | 'desc'
