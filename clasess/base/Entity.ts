import { QueryParams } from '../../types/query_params'
import Amo from '../Amo'
import { CreateResponse, Response, UpdateResponse } from '../../types/responses'
import logError from '../../utils/error'
import { CustomField } from '../../types/custom_fields'
import {
  EntitiesType,
  EntityClass,
  EntitiesFields,
  PartialExcept,
  SecondEntityType,
  UnlinkData,
  LinkData,
  ToUpdate,
} from '../../types/entity'

export default class Entity<N extends EntitiesType, E extends EntitiesFields, Q extends QueryParams>
  implements EntityClass<E, Q>
{
  constructor(
    protected amo: Amo,
    protected type: EntitiesType,
  ) {
    this.url = 'api/v4/' + type
    this.type = type.split('/').at(-1) as EntitiesType
    this.limit = 250
  }

  readonly url: string
  readonly limit: number

  async get(params: Q = {} as Q, page = 1, acc: E[] = []): Promise<E[] | null> {
    try {
      const response = await this.amo.instance.get<Response<N, E>>(this.url, {
        params: {
          limit: this.limit,
          page,
          ...params,
        },
      })
      const entity = response.data._embedded?.[this.type]
      if (!entity) return []
      const result = acc.concat(entity)
      if (entity.length === (params.limit || this.limit) && !params.page) {
        return this.get(params, ++page, result)
      }
      return result
    } catch (error) {
      logError(`get ${this.type} error`, error, error.response?.data, this.amo.options?.logs?.customLogger)
      if (this.amo.options?.logs?.throwErrors) throw error
      return null
    }
  }

  getCustomFieldById(entity: E, id: number): CustomField | null {
    const field = entity.custom_fields_values?.find((field) => {
      if (field.field_id && field.field_id === id) return field
    })
    return field || null
  }

  getNewest(entities: E[], by: 'created_at' | 'updated_at'): E {
    let newest = entities[0]
    for (const entity of entities) {
      if (entity[by] > newest[by]) newest = entity
    }
    return newest
  }

  async create(entities: Partial<E>[]): Promise<CreateResponse[] | null> {
    try {
      const response = await this.amo.instance.post<Response<N, CreateResponse>>(this.url, entities)
      return response.data._embedded?.[this.type]
    } catch (error) {
      logError(`get ${this.type} error`, error, error.response?.data, this.amo.options?.logs?.customLogger)
      if (this.amo.options?.logs?.throwErrors) throw error
      return null
    }
  }

  async update(
    entities: (E extends infer ExtendebleEntitiesForUpdate
      ? PartialExcept<E, 'id'> & ToUpdate
      : PartialExcept<E, 'id'>)[],
  ): Promise<UpdateResponse[] | null> {
    try {
      const response = await this.amo.instance.patch<Response<N, UpdateResponse>>(this.url, entities)
      return response.data._embedded?.[this.type]
    } catch (error) {
      logError(`get ${this.type} error`, error, error.response?.data, this.amo.options?.logs?.customLogger)
      if (this.amo.options?.logs?.throwErrors) throw error
      return null
    }
  }

  async link(entity: SecondEntityType, id: number, linkIds: number[]): Promise<void> {
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
      logError(`link ${this.type} error`, error, error.response?.data, this.amo.options?.logs?.customLogger)
      if (this.amo.options?.logs?.throwErrors) throw error
    }
  }

  async unlink(entity: SecondEntityType, id: number, linkIds: number[]): Promise<void> {
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
      logError(`unlink ${this.type} error`, error, error.response?.data, this.amo.options?.logs?.customLogger)
      if (this.amo.options?.logs?.throwErrors) throw error
    }
  }
}
