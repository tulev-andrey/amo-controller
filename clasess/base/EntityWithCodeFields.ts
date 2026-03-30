import { CustomField } from '../../types/custom_fields'
import { EntitiesFields, EntitiesType } from '../../types/entity'
import { QueryParams } from '../../types/query_params'
import Amo from '../Amo'
import Entity from './Entity'

export default class EntityWithCodeFields<
  N extends EntitiesType,
  E extends EntitiesFields,
  Q extends QueryParams,
> extends Entity<N, E, Q> {
  constructor(
    protected amo: Amo,
    name: N,
  ) {
    super(amo, name)
  }

  public async getByCode(query: string, code: 'PHONE' | 'EMAIL', params: Q = {} as Q): Promise<E[] | null> {
    if (!query) return null
    if (code === 'PHONE') query = this.chorePhone(query)
    if (code === 'EMAIL') query = this.choreEmail(query)

    const result: E[] = []
    const entities = await this.get({ ...params, query })
    if (!entities) return null

    for (const entity of entities) {
      const field = this.getCustomFieldByCode(entity, code)
      if (field) {
        const values = field.values.map((value) => value.value)
        const test = values.some((value) => {
          if (code === 'PHONE') return query === this.chorePhone(value)
          if (code === 'EMAIL') return query === this.choreEmail(value)
          return false
        })
        if (test) {
          result.push(entity)
        }
      }
    }

    return result.length ? result : null
  }

  public getCustomFieldByCode(entity: E, code: 'PHONE' | 'EMAIL'): CustomField | null {
    const field = entity.custom_fields_values?.find((field) => {
      if (field.field_code && field.field_code === code) return field
    })
    return field || null
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
