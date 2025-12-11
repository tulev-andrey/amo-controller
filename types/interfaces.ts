import { DefaultQueryParams } from './query_params'

export interface EntityClass<E> {
  url: string
  limit: number
  get(params: DefaultQueryParams, page: number, acc: E[]): Promise<E[] | null>
}
