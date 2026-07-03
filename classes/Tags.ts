import Amo from './Amo.js'
import { SecondEntityType } from '../types/entity.js'
import { Tag } from '../types/tag.js'
import EntityGetOnly from './base/EntityGetOnly.js'
import { TagQueryParams } from '../types/query_params.js'

export default class Tags<S extends SecondEntityType> extends EntityGetOnly<`${S}/tags`, Tag, TagQueryParams> {
  constructor(
    protected amo: Amo,
    protected entity: S,
  ) {
    super(amo, `${entity}/tags`)
  }
}
