import { QueryParams } from '../../types/query_params.js'
import Amo from '../Amo.js'
import { CreateResponse, Response, UpdateResponse } from '../../types/responses.js'
import logError from '../../utils/error.js'
import {
  EntitiesType,
  EntityClass,
  EntitiesFields,
  ExtendableEntitiesForUpdate,
  PartialExcept,
  ToUpdate,
} from '../../types/entity.js'
import { AxiosError } from 'axios'

/**
 * Base class for simple entities (notes, tasks) that support basic CRUD operations.
 * Does not support linking or custom field helpers.
 * @template N - Entity type name (e.g., 'notes', 'tasks')
 * @template E - Entity interface type
 * @template Q - Query parameters type
 */
export default class Entity<N extends EntitiesType, E extends EntitiesFields, Q extends QueryParams>
  implements EntityClass<E, Q>
{
  /**
   * Create a new Entity instance.
   * @param amo - Parent Amo instance for API access
   * @param type - API endpoint type (e.g., 'notes', 'tasks')
   */
  constructor(
    protected readonly amo: Amo,
    protected readonly type: N,
  ) {
    this.url = 'api/v4/' + type
    this.type = type.split('/').at(-1) as N
  }

  /** API endpoint URL */
  readonly url: string

  /**
   * Fetch entities with pagination.
   * @param params - Query parameters for filtering, sorting, etc.
   * @param page - Page number (1-based), used internally for recursion
   * @param acc - Accumulator for recursive pagination
   * @returns Array of entities
   */
  async get(params: Q = {} as Q, page = 1, acc: E[] = []): Promise<E[]> {
    try {
      const limit = this.amo.options?.limit ?? 250
      const response = await this.amo.instance.get<Response<N, E>>(this.url, {
        params: {
          limit,
          page,
          ...params,
        },
      })

      const entity = response.data._embedded?.[this.type]
      if (!entity) return acc

      const result = acc.concat(entity)

      // Continue pagination only if we got a full page of results and no specific page was requested
      if (entity.length === (params.limit || limit) && !params.page) {
        return this.get(params, ++page, result)
      }

      return result
    } catch (error) {
      logError(
        `get ${this.type} error`,
        error,
        error instanceof AxiosError ? error.response?.data : null,
        this.amo.options?.logs?.customLogger,
      )
      if (this.amo.options?.logs?.throwErrors) throw error
      return []
    }
  }

  /**
   * Find the newest entity by timestamp field.
   * @param entities - Array of entities to search
   * @param by - Field to compare ('created_at' or 'updated_at')
   * @returns The newest entity or undefined if array is empty
   */
  getNewest(entities: E[], by: 'created_at' | 'updated_at'): E | undefined {
    // Handle empty array case
    if (!entities || entities.length === 0) return undefined

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
   * @returns The oldest entity or undefined if array is empty
   */
  getOldest(entities: E[], by: 'created_at' | 'updated_at'): E | undefined {
    // Handle empty array case
    if (!entities || entities.length === 0) return undefined

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
      // Handle empty array case
      if (!entities || entities.length === 0) return []

      const response = await this.amo.instance.post<Response<N, CreateResponse>>(this.url, entities)
      return response.data._embedded?.[this.type] || []
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
      // Handle empty array case
      if (!entities || entities.length === 0) return []

      const response = await this.amo.instance.patch<Response<N, UpdateResponse>>(this.url, entities)
      return response.data._embedded?.[this.type] || []
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
}
