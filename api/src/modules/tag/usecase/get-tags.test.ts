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
        userId: '1',
        createdAt: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 2,
        name: 'React',
        userId: '1',
        createdAt: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 3,
        name: 'Next.js',
        userId: '1',
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    ]

    vi.mocked(TagRepository.findAll).mockResolvedValue(mockTags)

    const userId = '1'
    const result = await getTags(userId)

    expect(result).toEqual(mockTags)
    expect(TagRepository.findAll).toHaveBeenCalledTimes(1)
  })
})
