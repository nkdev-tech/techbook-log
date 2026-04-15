import { SelectTag } from '../entity/tag'
import { TagRepository } from '../repository/tag-repository'

export const getTags = async (d1: D1Database): Promise<SelectTag[]> => {
  return await TagRepository.findAll(d1)
}
