import Amo from './Amo.js'
import { MainEntitiesType } from '../types/entity.js'
import { Tag } from '../types/tag.js'
import EntityGetOnly from './base/EntityGetOnly.js'
import { TagQueryParams } from '../types/query_params.js'

/**
 * Tags management for a specific entity type (leads, contacts, companies).
 * Read-only access to tags.
 * @template S - The parent entity type ('leads' | 'contacts' | 'companies')
 * @extends EntityGetOnly
 */
export default class Tags<S extends MainEntitiesType> extends EntityGetOnly<`${S}/tags`, Tag, TagQueryParams> {
  /**
   * Create a new Tags manager for a specific entity type.
   * @param amo - Parent Amo instance
   * @param entity - Parent entity type ('leads', 'contacts', or 'companies')
   */
  constructor(
    protected readonly amo: Amo,
    protected readonly entity: S,
  ) {
    super(amo, `${entity}/tags`)
  }
}
