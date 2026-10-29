import { GetOnlyParams } from '../../types/query_params.js'
import Amo from '../Amo.js'
import { ResponseGetOnly } from '../../types/responses.js'
import logError from '../../utils/error.js'
import { EntitiesGetOnlyType, EntityGetOnlyClass } from '../../types/entity_get_only.js'
import { AxiosError } from 'axios'
import type { EntitiesGetOnly } from '../../types/entity_get_only.js'

export default class EntityGetOnly<N extends EntitiesGetOnlyType, E extends EntitiesGetOnly, Q extends GetOnlyParams>
  implements EntityGetOnlyClass<E, Q>
{
  constructor(
    protected amo: Amo,
    protected type: N,
  ) {
    this.url = 'api/v4/' + type

    if (/\//.test(type)) {
      const segments = type.split('/')
      this.type = segments[segments.length - 1] as N
    }
  }

  readonly url: string

  async get(params: Q = {} as Q, page = 1, acc: E[] = []): Promise<E[]> {
    try {
      const limit = this.amo.options?.limit ?? 250
      const response = await this.amo.instance.get<ResponseGetOnly<N, E>>(this.url, {
        params: {
          limit,
          page,
          ...params,
        },
      })
      const entity = response.data._embedded?.[this.type]
      if (!entity) return acc
      const result = acc.concat(entity)
      // !params.page - need to get all pages if page is not set in params
      if (entity.length === (params?.limit || limit) && !params?.page) {
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
}
