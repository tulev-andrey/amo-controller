import { CustomField } from './custom_fields'
import { Tag } from './tag'

export interface Lead {
  id: number
  name: string
  price: number
  responsible_user_id: number
  group_id: number
  status_id: number
  pipeline_id: number
  loss_reason_id: number
  source_id: number
  created_by: number
  updated_by: number
  closed_at: number
  created_at: number
  updated_at: number
  closest_task_at: number
  is_deleted: boolean
  account_id: number
  custom_fields_values: CustomField[] | null
  _embedded: LeadEmbedded
}

export interface LeadEmbedded {
  contacts?: Partial<EmbeddedContact>[]
  companies: Partial<EmbeddedCompany>[]
  tags: Partial<Tag>[]
}

export interface EmbeddedContact {
  id: number
  is_main: boolean
}

export interface EmbeddedCompany {
  id: number
}
