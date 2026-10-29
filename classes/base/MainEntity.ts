import { QueryParams } from '../../types/query_params.js'
import Amo from '../Amo.js'
import { CreateResponse, UpdateResponse, type MainResponse } from '../../types/responses.js'
import logError from '../../utils/error.js'
import { CustomField } from '../../types/custom_fields.js'
import {
  type ExtendableEntitiesForUpdate,
  type PartialExcept,
  type UnlinkData,
  type LinkData,
  type ToUpdate,
  type EntityWithEntry,
  type MainEntitiesType,
  type MainEntityClass,
} from '../../types/entity.js'
import { AxiosError } from 'axios'
import type { ArrayOfEntities, GetCustomFieldInstance } from '../helpers/ArraysOfEntities.js'
import { GetCustomField } from '../helpers/GetCustomField.js'

/**
 * Base class for main entities (leads, contacts, companies) that support
 * full CRUD operations, linking, and custom field access.
 * @template N - Entity type name (e.g., 'leads', 'contacts', 'companies')
 * @template E - Entity interface type (Lead, Contact, Company)
 * @template Q - Query parameters type
 */
export default class MainEntity<N extends MainEntitiesType, E extends EntityWithEntry, Q extends QueryParams>
  implements MainEntityClass<E, Q>
{
  /**
   * Create a new MainEntity instance.
   * @param amo - Parent Amo instance for API access
   * @param type - API endpoint type (e.g., 'leads', 'contacts', 'companies')
   * @param Ctor - Constructor for ArrayOfEntities wrapper (usually ArrayOfEntities class)
   */
  constructor(
    protected readonly amo: Amo,
    protected readonly type: N,
    protected readonly Ctor: new (
      entities: E[],
      Ctor: new (entity: E) => GetCustomFieldInstance<E>,
    ) => ArrayOfEntities<E>,
  ) {
    this.url = 'api/v4/' + type
    this.type = type.split('/').at(-1) as N
  }

  /** API endpoint URL */
  readonly url: string

  /**
   * Fetch entities with pagination, returning enhanced ArrayOfEntities.
   * @param params - Query parameters for filtering, sorting, etc.
   * @param page - Page number (1-based), used internally for recursion
   * @param acc - Accumulator for recursive pagination
   * @returns ArrayOfEntities with helper methods (getNewest, getOldest, getCustomFieldFromAll)
   */
  async get(params: Q = {} as Q, page = 1, acc: E[] = []): Promise<ArrayOfEntities<E>> {
    try {
      const limit = this.amo.options?.limit ?? 250
      const response = await this.amo.instance.get<MainResponse<N, E>>(this.url, {
        params: {
          limit,
          page,
          ...params,
        },
      })
      const entity = response.data._embedded?.[this.type]
      if (!entity) return new this.Ctor(acc, GetCustomField as new (entity: E) => GetCustomFieldInstance<E>)
      const result = acc.concat(entity)
      // !params.page - need to get all pages if page is not set in params
      if (entity.length === (params.limit || limit) && !params.page) {
        return this.get(params, ++page, result)
      }
      return new this.Ctor(result, GetCustomField as new (entity: E) => GetCustomFieldInstance<E>)
    } catch (error) {
      logError(
        `get ${this.type} error`,
        error,
        error instanceof AxiosError ? error.response?.data : null,
        this.amo.options?.logs?.customLogger,
      )
      if (this.amo.options?.logs?.throwErrors) throw error
      return new this.Ctor([], GetCustomField as new (entity: E) => GetCustomFieldInstance<E>)
    }
  }

  /**
   * Get a custom field by its numeric ID from an entity.
   * @param entity - Entity to search in
   * @param id - Numeric field ID
   * @returns CustomField or null if not found
   */
  getCustomFieldById(entity: E, id: number): CustomField | null {
    const field = entity.custom_fields_values?.find((field) => {
      if (field.field_id && field.field_id === id) return field
    })
    return field || null
  }

  /**
   * Find the newest entity by timestamp field.
   * @param entities - Array of entities to search
   * @param by - Field to compare ('created_at' or 'updated_at')
   * @returns The newest entity
   */
  getNewest(entities: E[], by: 'created_at' | 'updated_at'): E {
    let newest = entities[0]
    for (const entity of entities) {
      const newestBy = newest[by]
      if (!newestBy) {
        newest = entity
        continue
      }
      const entityBy = entity[by]
      if (!entityBy) continue
      if (entityBy > newestBy) newest = entity
    }
    return newest
  }

  /**
   * Find the oldest entity by timestamp field.
   * @param entities - Array of entities to search
   * @param by - Field to compare ('created_at' or 'updated_at')
   * @returns The oldest entity
   */
  getOldest(entities: E[], by: 'created_at' | 'updated_at'): E {
    let oldest = entities[0]
    for (const entity of entities) {
      const oldestBy = oldest[by]
      if (!oldestBy) {
        oldest = entity
        continue
      }
      const entityBy = entity[by]
      if (!entityBy) continue
      if (entityBy < oldestBy) oldest = entity
    }
    return oldest
  }

  /**
   * Create new entities.
   * @param entities - Array of partial entity data (required fields must be included)
   * @returns Array of created entity responses with IDs
   */
  async create(entities: Partial<E>[]): Promise<CreateResponse[]> {
    try {
      const response = await this.amo.instance.post<MainResponse<N, CreateResponse>>(this.url, entities)
      return response.data._embedded?.[this.type]
    } catch (error) {
      logError(
        `create ${this.type} error`,
        error,
        error instanceof AxiosError ? error.response?.data : null,
        this.amo.options?.logs?.customLogger,
      )
      if (this.amo.options?.logs?.throwErrors) throw error
      return []
    }
  }

  /**
   * Update existing entities.
   * @param entities - Array of entities with ID and fields to update
   * @returns Array of updated entity responses
   */
  async update(
    entities: (E extends ExtendableEntitiesForUpdate ? PartialExcept<E, 'id'> & ToUpdate : PartialExcept<E, 'id'>)[],
  ): Promise<UpdateResponse[]> {
    try {
      const response = await this.amo.instance.patch<MainResponse<N, UpdateResponse>>(this.url, entities)
      return response.data._embedded?.[this.type]
    } catch (error) {
      logError(
        `update ${this.type} error`,
        error,
        error instanceof AxiosError ? error.response?.data : null,
        this.amo.options?.logs?.customLogger,
      )
      if (this.amo.options?.logs?.throwErrors) throw error
      return []
    }
  }

  /**
   * Link this entity to other entities.
   * @param entity - Type of entity to link to
   * @param id - ID of this entity
   * @param linkIds - IDs of entities to link
   */
  async link(entity: MainEntitiesType, id: number, linkIds: number[]): Promise<void> {
    try {
      const data: LinkData[] = []
      for (const link of linkIds)
        data.push({
          entity_id: id,
          to_entity_id: link,
          to_entity_type: entity,
        })
      await this.amo.instance.post(this.url + '/link', data)
    } catch (error) {
      logError(
        `link ${this.type} error`,
        error,
        error instanceof AxiosError ? error.response?.data : null,
        this.amo.options?.logs?.customLogger,
      )
      if (this.amo.options?.logs?.throwErrors) throw error
    }
  }

  /**
   * Unlink this entity from other entities.
   * @param entity - Type of entity to unlink from
   * @param id - ID of this entity
   * @param linkIds - IDs of entities to unlink
   */
  async unlink(entity: MainEntitiesType, id: number, linkIds: number[]): Promise<void> {
    try {
      const data: UnlinkData[] = []
      for (const link of linkIds)
        data.push({
          entity_id: id,
          to_entity_id: link,
          to_entity_type: entity,
        })
      await this.amo.instance.post(this.url + '/unlink', data)
    } catch (error) {
      logError(
        `unlink ${this.type} error`,
        error,
        error instanceof AxiosError ? error.response?.data : null,
        this.amo.options?.logs?.customLogger,
      )
      if (this.amo.options?.logs?.throwErrors) throw error
    }
  }
}
