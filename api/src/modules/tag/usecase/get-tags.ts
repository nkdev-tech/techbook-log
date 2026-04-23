import { SelectTag } from '../entity/tag'
import { TagRepository } from '../repository/tag-repository'

export const getTags = async (): Promise<SelectTag[]> => {
  return await TagRepository.findAll()
}
