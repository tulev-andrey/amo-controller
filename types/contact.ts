import { CustomField } from './custom_fields'
import { Tag } from './tag'

export interface Contact {
  id: number
  name: string
  first_name: string
  last_name: string
  responsible_user_id: number
  group_id: number
  created_by: number
  updated_by: number
  created_at: number
  updated_at: number
  closest_task_at: number | null
  is_deleted: boolean
  custom_fields_values: CustomField[] | null
  account_id: number
  _embedded: ContactEmbedded
}

export interface ContactEmbedded {
  leads?: Partial<EmbeddedLead>[]
  companies?: Partial<EmbeddedCompany>[]
  tags?: Partial<Tag>[]
}

export interface EmbeddedLead {
  id: number
}

export interface EmbeddedCompany {
  id: number
}
