import type { EntitiesFields } from './entity'
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

export interface EntityGetOnlyClass<E extends EntitiesFields, Q extends GetOnlyParams> {
  url: string
  limit: number
  get(params: Q, page: number, acc: E[]): Promise<E[] | null>
  getNewest(entities: E[], by: 'created_at' | 'updated_at'): E
  getOldest(entities: E[], by: 'created_at' | 'updated_at'): E
}
