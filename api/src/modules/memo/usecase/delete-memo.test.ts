import { beforeEach, describe, expect, it, vi } from 'vitest'
import { deleteMemo } from './delete-memo'
import { MemoRepository } from '../repository/memo-repository'

vi.mock('../repository/memo-repository')

describe('deleteMemo', () => {
  beforeEach(() => vi.clearAllMocks())

  it('can delete memo', async () => {
    const mockMemo = {
      id: 1,
      bookId: 1,
      content: 'メモ1',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }
    vi.mocked(MemoRepository.delete).mockResolvedValue(mockMemo)

    const id = 1
    const result = await deleteMemo(id)

    expect(result).toEqual(mockMemo)
    expect(MemoRepository.delete).toHaveBeenCalledTimes(1)
  })

  it('cannot delete memo when memo does not exist', async () => {
    vi.mocked(MemoRepository.delete).mockResolvedValue(null)

    const id = 1
    const result = await deleteMemo(id)

    expect(result).toBeNull()
    expect(MemoRepository.delete).toHaveBeenCalledTimes(1)
  })
})
