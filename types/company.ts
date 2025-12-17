import { CustomField } from './custom_fields'
import { Tag } from './tag'

export interface Company {
  id: number
  name: string
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
  _embedded: CompanyEmbedded
}

export interface CompanyEmbedded {
  leads?: Partial<EmbeddedLead>[]
  contacts?: Partial<EmbeddedContact>[]
  tags: Partial<Tag>[]
}

export interface EmbeddedLead {
  id: number
}

export interface EmbeddedContact {
  id: number
}
