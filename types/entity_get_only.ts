import type { LossReason } from './loss_reason.js'
import type { Pipeline } from './pipeline.js'
import type { Tag } from './tag.js'
import type { User } from './user.js'
import type { Event } from './events.js'
import { GetOnlyParams } from './query_params.js'

export type EntitiesGetOnlyType =
  | 'account'
  | 'pipelines'
  | 'leads/pipelines'
  | 'users'
  | 'loss_reasons'
  | 'leads/loss_reasons'
  | 'tags'
  | 'leads/tags'
  | 'contacts/tags'
  | 'companies/tags'
  | 'leads/custom_fields'
  | 'contacts/custom_fields'
  | 'companies/custom_fields'
  | 'events'

export interface EntityGetOnlyClass<E extends EntitiesGetOnly, Q extends GetOnlyParams> {
  url: string
  get(params: Q, page: number, acc: E[]): Promise<E[] | null>
}

export interface EntitiesGetOnlyByAtClass<E extends EntitiesGetOnlyByAt, Q extends GetOnlyParams> {
  url: string
  get(params: Q, page: number, acc: E[]): Promise<E[] | null>
  getNewest(entities: E[], by: 'created_at' | 'updated_at'): E
  getOldest(entities: E[], by: 'created_at' | 'updated_at'): E
}

export type EntitiesGetOnly = Pipeline | User | Tag | EntitiesGetOnlyByAt

export type EntitiesGetOnlyByAt = LossReason | Event
