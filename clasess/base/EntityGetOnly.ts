import { GetOnlyParams } from '../../types/query_params'
import Amo from '../Amo'
import { ResponseGetOnly } from '../../types/responses'
import logError from '../../utils/error'
import { EntitiesGetOnlyType, EntityGetOnlyClass } from '../../types/entity_get_only'

export default class EntityGetOnly<N extends EntitiesGetOnlyType, E, Q extends GetOnlyParams>
  implements EntityGetOnlyClass<E, Q>
{
  constructor(
    protected amo: Amo,
    protected type: EntitiesGetOnlyType,
  ) {
    this.url = 'api/v4/' + type
    this.limit = 100

    if (/\//.test(type)) {
      const splited = type.split('/')
      this.type = splited[splited.length - 1] as EntitiesGetOnlyType
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
      if (!entity) return []
      const result = acc.concat(entity)
      if (entity.length === this.limit) {
        return this.get(params, ++page, result)
      }
      return result
    } catch (error) {
      logError(`get ${this.type} error`, error, error.response?.data, this.amo.options?.logs?.customLogger)
      if (this.amo.options?.logs?.throwErrors) throw error
      return null
    }
  }
}
