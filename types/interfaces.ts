import { DefaultQueryParams } from './query_params.js'

export interface EntityClass<E> {
  url: string
  limit: number
  get(params: DefaultQueryParams, page: number, acc: E[]): Promise<E[] | null>
}
