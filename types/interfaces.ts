import { QueryParams } from './query_params'

export interface EntityClass<E> {
  url: string
  limit: number
  get(params: QueryParams, page: number, acc: E[]): Promise<E[] | null>
}
