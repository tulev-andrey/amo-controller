import { GetOnlyParams } from './query_params'

export type EntitiesGetOnlyType =
  | 'pipelines'
  | 'leads/pipelines'
  | 'users'
  | 'loss_reasons'
  | 'leads/loss_reasons'
  | 'tags'
  | 'leads/tags'
  | 'contacts/tags'
  | 'companies/tags'
  | 'events'

export interface EntityGetOnlyClass<E, Q extends GetOnlyParams> {
  url: string
  limit: number
  get(params: Q, page: number, acc: E[]): Promise<E[] | null>
}
