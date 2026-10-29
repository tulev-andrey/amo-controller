import type { CustomField, CustomFieldValue } from '../../types/custom_fields.js'
import type { EntityWithEntry } from '../../types/entity.js'

/**
 * Wrapper class providing convenient access to entity fields and custom fields.
 * Used by ArrayOfEntities to enhance raw API responses with helper methods.
 */
export class GetCustomField<E extends EntityWithEntry> {
  constructor(public readonly entity: E) {
    Object.assign(this, entity)
  }

  /**
   * Get any field value from the entity by key.
   * @param key - The field name to retrieve
   * @returns The field value or undefined if the field doesn't exist
   */
  getField<K extends keyof E>(key: K): E[K] | undefined {
    return this.entity[key]
  }

  /**
   * Find a custom field by its numeric ID or string code (e.g., 'PHONE', 'EMAIL').
   * @param field_id - Numeric field ID or string field code
   * @returns The custom field or null if not found
   */
  getCustomField(field_id: number | string): CustomField | null {
    // Check if entity has custom_fields_values
    if (!this.entity.custom_fields_values) {
      return null
    }

    // Find the field by ID or code
    if (typeof field_id === 'number') {
      return this.entity.custom_fields_values.find((field) => field.field_id === field_id) ?? null
    }

    if (typeof field_id === 'string') {
      return this.entity.custom_fields_values.find((field) => field.field_code === field_id) ?? null
    }

    return null
  }

  getCustomFieldValue(field_id: number | string): CustomFieldValue[] | null {
    // Check if entity has custom_fields_values
    if (!this.entity.custom_fields_values) {
      return null
    }

    // Find the field by ID or code
    if (typeof field_id === 'number') {
      const field = this.entity.custom_fields_values.find((field) => field.field_id === field_id)
      if (field) return field.values.map((v) => v.value)
      else return null
    }

    if (typeof field_id === 'string') {
      const field = this.entity.custom_fields_values.find((field) => field.field_code === field_id)
      if (field) return field.values.map((v) => v.value)
      else return null
    }

    return null
  }
}
