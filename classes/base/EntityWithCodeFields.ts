import { type EntityWithEntry, type MainEntitiesType } from '../../types/entity.js'
import { QueryParams } from '../../types/query_params.js'
import Amo from '../Amo.js'
import type { ArrayOfEntities, GetCustomFieldInstance } from '../helpers/ArraysOfEntities.js'
import { GetCustomField } from '../helpers/GetCustomField.js'
import MainEntity from './MainEntity.js'

export default class EntityWithCodeFields<
  N extends MainEntitiesType,
  E extends EntityWithEntry,
  Q extends QueryParams,
> extends MainEntity<N, E, Q> {
  constructor(
    protected amo: Amo,
    name: N,
    protected Ctor: new (entities: E[], Ctor: new (entity: E) => GetCustomFieldInstance<E>) => ArrayOfEntities<E>,
  ) {
    super(amo, name, Ctor)
  }

  public async getByCode(
    query: string,
    code: 'PHONE' | 'EMAIL',
    params: Q = {} as Q,
  ): Promise<ArrayOfEntities<E> | null> {
    if (!query) return null
    if (code === 'PHONE') query = this.chorePhone(query)
    if (code === 'EMAIL') query = this.choreEmail(query)

    const result: E[] = []
    const entities = await this.get({ ...params, query })
    if (!entities) return null

    for (const entity of entities) {
      const field = entity.getCustomField(code)
      if (field && field.values) {
        const values = field.values.map((value) => value.value)
        const test = values.some((value) => {
          const str = typeof value === 'string' ? value : String(value ?? '')
          if (code === 'PHONE') return query === this.chorePhone(str)
          if (code === 'EMAIL') return query === this.choreEmail(str)
          return false
        })
        if (test) {
          result.push(entity.entity)
        }
      }
    }

    return result.length ? new this.Ctor(result, GetCustomField as new (entity: E) => GetCustomFieldInstance<E>) : null
  }

  chorePhone(phone: string) {
    phone = phone.replace(/\D/g, '')
    if (phone.length === 11 && (phone.startsWith('8') || phone.startsWith('7'))) phone = phone.substring(1)
    return phone
  }

  choreEmail(email: string) {
    return email.trim().toLowerCase()
  }
}
