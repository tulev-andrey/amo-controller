import { DefaultQueryParams, QueryParams } from './query_params'
import { CustomField } from './custom_fields'
import { CreateResponse, UpdateResponse } from './responses'
import { Lead } from './lead'
import { Contact } from './contact'
import { Company } from './company'

export type EntitiesType =
  | 'leads'
  | 'contacts'
  | 'companies'
  | 'notes'
  | 'tasks'
  | 'leads/notes'
  | 'contacts/notes'
  | 'companies/notes'
export type SecondEntityType = 'leads' | 'contacts' | 'companies'

export interface EntityClass<E extends EntitiesFields, Q extends QueryParams> {
  url: string
  limit: number
  get(params: Q, page: number, acc: E[]): Promise<E[] | null>
  create(entities: Partial<E>[]): Promise<CreateResponse[] | null>
  update(entities: PartialExcept<E, 'id'>[]): Promise<UpdateResponse[] | null>
  unlink(entity: SecondEntityType, id: number, linkIds: number[]): Promise<void>
  getCustomFieldById(entity: E, id: number): CustomField | null
  getNewest(entities: E[], by: 'created_at' | 'updated_at'): E
}

export interface EntitiesFields {
  id?: number
  created_at: number
  updated_at: number
  custom_fields_values?: CustomField[] | null
}

export type ExtendebleEntitiesForUpdate = Lead | Contact | Company

export interface ToUpdate {
  tags_to_add?: { id?: number; name?: string }[]
  tags_to_delete?: { id?: number; name?: string }[]
}

export type PartialExcept<T, K extends keyof T> = Partial<Omit<T, K>> & Pick<T, K>

export interface LinkData {
  entity_id: number
  to_entity_id: number
  to_entity_type: SecondEntityType
}

export interface UnlinkData extends LinkData {}
