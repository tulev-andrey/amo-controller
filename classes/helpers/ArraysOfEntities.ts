import type { EntityWithEntry } from '../../types/entity.js'
import type { GetCustomField } from './GetCustomField.js'
import type { CustomField, CustomFieldValue } from '../../types/custom_fields.js'

/**
 * Enhanced array of entities with helper methods for finding entities
 * and extracting custom fields across all entities.
 * Extends native Array with GetCustomField-wrapped entities.
 */
export class ArrayOfEntities<E extends EntityWithEntry> extends Array<GetCustomFieldInstance<E>> {
  /**
   * Create an ArrayOfEntities from raw API entities.
   * @param entities - Raw entities from AmoCRM API
   * @param Ctor - Constructor for GetCustomField wrapper (usually GetCustomField class)
   */
  constructor(entities: E[], Ctor: new (entity: E) => GetCustomFieldInstance<E>) {
    super()
    if (Array.isArray(entities)) {
      for (const entity of entities) {
        this.push(new Ctor(entity))
      }
    }
  }

  /**
   * Find the most recently created/updated entity.
   * @param by - Field to compare: 'created_at' or 'updated_at'
   * @returns The newest entity wrapped in GetCustomField or undefined if array is empty
   */
  getNewest(by: 'created_at' | 'updated_at'): GetCustomFieldInstance<E> | undefined {
    if (this.length === 0) return undefined

    let newest = this[0]
    for (let i = 1; i < this.length; i++) {
      const entity = this[i]
      const newestField = newest.getField(by)
      const entityField = entity.getField(by)

      // Skip entities without the field
      if (!entityField) continue

      // If newest doesn't have the field, use current entity
      if (!newestField) {
        newest = entity
        continue
      }

      // Compare dates
      if (entityField > newestField) {
        newest = entity
      }
    }
    return newest
  }

  /**
   * Find the oldest created/updated entity.
   * @param by - Field to compare: 'created_at' or 'updated_at'
   * @returns The oldest entity wrapped in GetCustomField or undefined if array is empty
   */
  getOldest(by: 'created_at' | 'updated_at'): GetCustomFieldInstance<E> | undefined {
    if (this.length === 0) return undefined

    let oldest = this[0]
    for (let i = 1; i < this.length; i++) {
      const entity = this[i]
      const oldestField = oldest.getField(by)
      const entityField = entity.getField(by)

      // Skip entities without the field
      if (!entityField) continue

      // If oldest doesn't have the field, use current entity
      if (!oldestField) {
        oldest = entity
        continue
      }

      // Compare dates
      if (entityField < oldestField) {
        oldest = entity
      }
    }
    return oldest
  }

  /**
   * Extract a specific custom field from all entities in the array.
   * @param field_id - Numeric field ID or string field code (e.g., 'PHONE', 'EMAIL')
   * @returns Array of custom fields (or null for entities without that field)
   */
  getCustomFieldFromAll(field_id: number | string): (CustomField | null)[] {
    return this.map((entity) => entity.getCustomField(field_id))
  }

  getCustomFieldValueFromAll(field_id: number | string): (CustomFieldValue | null)[] {
    return this.map((entity) => entity.getCustomFieldValue(field_id)).flat()
  }
}

export type GetCustomFieldInstance<E extends EntityWithEntry> = GetCustomField<E> & E
