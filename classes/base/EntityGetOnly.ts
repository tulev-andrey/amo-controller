import { GetOnlyParams } from '../../types/query_params'
import Amo from '../Amo'
import { ResponseGetOnly } from '../../types/responses'
import logError from '../../utils/error'
import { EntitiesGetOnlyType, EntityGetOnlyClass } from '../../types/entity_get_only'
import { AxiosError } from 'axios'
import type { EntitiesFields } from '../../types/entity'

export default class EntityGetOnly<N extends EntitiesGetOnlyType, E extends EntitiesFields, Q extends GetOnlyParams>
  implements EntityGetOnlyClass<E, Q>
{
  constructor(
    protected amo: Amo,
    protected type: N,
  ) {
    this.url = 'api/v4/' + type
    this.limit = 100

    if (/\//.test(type)) {
      const segments = type.split('/')
      this.type = segments[segments.length - 1] as N
    }
  }

  readonly url: string
  readonly limit: number

  async get(params: Q = {} as Q, page = 1, acc: E[] = []): Promise<E[] | null> {
    try {
      const response = await this.amo.instance.get<ResponseGetOnly<N, E>>(this.url, {
        params: {
          ...params,
          page,
          limit: this.limit,
        },
      })
      const entity = response.data._embedded?.[this.type]
      if (!entity) return acc
      const result = acc.concat(entity)
      if (entity.length === this.limit) {
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
      return null
    }
  }

  getNewest(entities: E[], by: 'created_at' | 'updated_at'): E {
    let newest = entities[0]
    for (const entity of entities) {
      if (!newest[by]) {
        newest = entity
        continue
      }
      if (!entity[by]) continue
      if (entity[by] > newest[by]) newest = entity
    }
    return newest
  }

  getOldest(entities: E[], by: 'created_at' | 'updated_at'): E {
    let oldest = entities[0]
    for (const entity of entities) {
      if (!oldest[by]) {
        oldest = entity
        continue
      }
      if (!entity[by]) continue
      if (entity[by] < oldest[by]) oldest = entity
    }
    return oldest
  }
}
