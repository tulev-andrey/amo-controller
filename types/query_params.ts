export interface QueryParams {
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

export interface FilterLeads extends MainFilter {
  price?: FromTo
  statuses?: { pipeline_id: number; status_id: number }[]
  pipeline_id?: number | number[]
}

export interface FilterContacts extends MainFilter {}

export interface FilterCompanies extends MainFilter {}

type FromTo = {
  from: number
  to: number
}

export interface UserQueryParams extends Omit<QueryParams, 'filter' | 'order' | 'query'> {}

interface EventFilter {
  id: string[]
  created_at?: FromTo
  created_by?: number | number[]
  entity?: 'lead' | 'contact' | 'company' | 'customer' | 'task'
  entity_id?: number | number[]
  type:
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
    | 'custom_field_{FIELD_ID}_value_changed'
  value_before: any
  value_after: any
}

export interface EventQueryParams extends Omit<QueryParams, 'filter' | 'order' | 'query'> {
  filter?: EventFilter
}

export interface PipelineQueryParams {}

export interface LossReasonQueryParams {}

interface TagFilter {
  id?: number | number[]
  name?: string
}

export interface TagQueryParams extends Omit<QueryParams, 'filter' | 'order'> {
  filter?: TagFilter
}

export type GetOnlyParams =
  | UserQueryParams
  | EventQueryParams
  | PipelineQueryParams
  | LossReasonQueryParams
  | TagQueryParams
