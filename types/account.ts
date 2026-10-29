export interface Account {
  id: number
  name: string
  subdomain: string
  current_user_id: number
  country: string
  customers_mode: string
  is_unsorted_on: boolean
  is_loss_reason_enabled: boolean
  is_helpbot_enabled: boolean
  is_technical_account: boolean
  contact_name_display_order: number
  amojo_id?: string
  version?: number
  drive_url?: string
  is_api_filter_enabled?: boolean
  entity_names?: object
  invoices_settings?: {
    lang: string
    invoices_catalog_id: number
  }
  _embedded?: AccountEmbedded
}

export interface AccountEmbedded {
  task_types?: TaskType[]
  amojo_rights?: AmojoRights
  users_groups?: UsersGroups[]
}

export interface TaskType {
  id: number
  name: string
  color: string
  icon_id: number
  code: string
  sort: number | null
  is_active: boolean
}

export interface AmojoRights {
  can_direct: boolean
  can_create_groups: boolean
}

export interface UsersGroups {
  id: number
  name: string
}

export interface AccountQuery {
  with?: 'amojo_id' | 'amojo_rights' | 'users_groups' | 'task_types' | 'version' | 'entity_names' | 'datetime_settings'
}
