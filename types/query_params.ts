export interface DefaultQueryParams {
  with?: string[]
  query?: string | number
  filter?: Filter
  limit?: number
  page?: number
  order?: {
    id?: Order
    created_at?: Order
    updated_at?: Order
  }
}

type Filter = FilterLeads | FilterContacts | FilterCompanies
type Order = 'asc' | 'desc'
type FromTo = {
  from?: number
  to?: number
}

export interface FilterLeads extends MainFilter {
  price?: FromTo
  statuses?: { pipeline_id: number; status_id: number }[]
  pipeline_id?: number | number[]
}

export interface FilterContacts extends MainFilter {}

export interface FilterCompanies extends MainFilter {}

export interface MainFilter {
  id?: number | number[]
  name?: string
  created_by?: number | number[]
  updated_by?: number | number[]
  responsible_user_id?: number | number[]
  created_at?: FromTo
  updated_at?: FromTo
  closed_at?: FromTo
  closest_task_at?: FromTo
}

export type QueryParams = DefaultQueryParams | TaskQueryParams

export interface NoteQueryParams extends Omit<DefaultQueryParams, 'with' | 'query' | 'filter'> {
  filter?: NoteFilter
}

export interface TaskQueryParams extends Omit<DefaultQueryParams, 'with' | 'query' | 'filter'> {
  filter?: TaskFilter
}

export type GetOnlyParams =
  | EventQueryParams
  | UserQueryParams
  | PipelineQueryParams
  | LossReasonQueryParams
  | TagQueryParams

export interface EventQueryParams extends Omit<DefaultQueryParams, 'filter' | 'order' | 'query'> {
  filter?: EventFilter
}

export interface UserQueryParams extends Omit<DefaultQueryParams, 'filter' | 'order' | 'query'> {}

export interface PipelineQueryParams {}

export interface LossReasonQueryParams {}

export interface TagQueryParams extends Omit<DefaultQueryParams, 'filter' | 'order'> {
  filter?: TagFilter
}

interface NoteFilter {
  id?: number | number[]
  entity_id?: number | number[]
  note_type?: NoteTypes
  updated_at?: FromTo
}

interface TaskFilter {
  id?: number | number[]
  entity_id?: number | number[]
  entity_type?: 'leads' | 'contacts' | 'companies' | 'customers'
  task_type?: number | number[]
  responsible_user_id?: number | number[]
  is_completed?: boolean
  updated_at?: FromTo
}

interface EventFilter {
  id?: string[]
  created_at?: FromTo
  created_by?: number | number[]
  entity?: 'lead' | 'contact' | 'company' | 'customer' | 'task'
  entity_id?: number | number[]
  type?:
    | 'lead_added'
    | 'lead_deleted'
    | 'lead_restored'
    | 'lead_status_changed'
    | 'lead_linked'
    | 'lead_unlinked'
    | 'contact_added'
    | 'contact_deleted'
    | 'contact_restored'
    | 'contact_linked'
    | 'contact_unlinked'
    | 'company_added'
    | 'company_deleted'
    | 'company_restored'
    | 'company_linked'
    | 'company_unlinked'
    | 'customer_added'
    | 'customer_deleted'
    | 'customer_status_changed'
    | 'customer_linked'
    | 'customer_unlinked'
    | 'task_added'
    | 'task_deleted'
    | 'task_completed'
    | 'task_type_changed'
    | 'task_text_changed'
    | 'task_deadline_changed'
    | 'task_result_added'
    | 'incoming_call'
    | 'outgoing_call'
    | 'incoming_chat_message'
    | 'outgoing_chat_message'
    | 'entity_direct_message'
    | 'incoming_sms'
    | 'outgoing_sms'
    | 'entity_tag_added'
    | 'entity_tag_deleted'
    | 'entity_linked'
    | 'entity_unlinked'
    | 'sale_field_changed'
    | 'name_field_changed'
    | 'ltv_field_changed'
    | 'custom_field_value_changed'
    | 'entity_responsible_changed'
    | 'robot_replied'
    | 'intent_identified'
    | 'nps_rate_added'
    | 'link_followed'
    | 'transaction_added'
    | 'common_note_added'
    | 'common_note_deleted'
    | 'attachment_note_added'
    | 'targeting_in_note_added'
    | 'targeting_out_note_added'
    | 'geo_note_added'
    | 'service_note_added'
    | 'site_visit_note_added'
    | 'message_to_cashier_note_added'
    | 'key_action_completed'
    | 'entity_merged'
    | `custom_field_${number}_value_changed`
  value_before?: any
  value_after?: any
}

interface TagFilter {
  id?: number | number[]
  name?: string
}

type NoteTypes =
  | 'common' // Текстовое примечание
  | 'call_in' // Входящий звонок
  | 'call_out' // Исходящий звонок
  | 'service_message' // Системное сообщение (добавляется интеграциями)
  | 'message_cashier' // Сообщение кассиру
  | 'geolocation' // Текстовое примечание с гео-координатами (добавляются мобильным приложением)
  | 'sms_in' // Входящее SMS
  | 'sms_out' // Исходящее SMS
  | 'extended_service_message' // Расширенное системное сообщение (поддерживает больше текста и сворачивается в интерфейсе)
  | 'attachment' // Примечание с файлом
