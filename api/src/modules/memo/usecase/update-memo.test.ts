import { beforeEach, describe, expect, it, vi } from 'vitest'
import { updateMemo } from './update-memo'
import { MemoRepository } from '../repository/memo-repository'

vi.mock('../repository/memo-repository')

describe('updateMemo', () => {
  beforeEach(() => vi.clearAllMocks())

  it('can update memo', async () => {
    const data = {
      content: 'メモ更新',
      pageNo: 111,
    }

    const mockMemo = {
      id: 1,
      bookId: 1,
      content: 'メモ1',
      pageNo: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }
    vi.mocked(MemoRepository.findById).mockResolvedValue(mockMemo)
    vi.mocked(MemoRepository.update).mockResolvedValue({ ...mockMemo, ...data })

    const id = 1
    const userId = '1'
    const result = await updateMemo(id, userId, data)

    expect(result).toEqual({ ...mockMemo, ...data })
    expect(MemoRepository.update).toHaveBeenCalledWith(
      id,
      userId,
      expect.objectContaining({
        content: 'メモ更新',
        pageNo: 111,
      })
    )
  })

  it('cannot update memo when memo does not exist', async () => {
    const data = {
      content: 'メモ更新',
    }
    vi.mocked(MemoRepository.findById).mockResolvedValue(null)

    const id = 1
    const userId = '1'
    const result = await updateMemo(id, userId, data)

    expect(result).toBeNull()
    expect(MemoRepository.update).toHaveBeenCalledTimes(0)
  })
})
