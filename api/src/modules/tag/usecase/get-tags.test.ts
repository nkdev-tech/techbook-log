import { describe, expect, it, vi } from 'vitest'
import { getTags } from './get-tags'
import { TagRepository } from '../repository/tag-repository'

vi.mock('../repository/tag-repository')

describe('getTags', () => {
  it('can get tags', async () => {
    const mockTags = [
      {
        id: 1,
        name: 'Typescript',
        createdAt: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 2,
        name: 'React',
        createdAt: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 3,
        name: 'Next.js',
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    ]

    vi.mocked(TagRepository.findAll).mockResolvedValue(mockTags)

    const mockD1 = {} as D1Database
    const result = await getTags(mockD1)

    expect(result).toEqual(mockTags)
    expect(TagRepository.findAll).toHaveBeenCalledTimes(1)
  })
})
