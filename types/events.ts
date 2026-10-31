export interface Event {
  id: string
  type: string
  entity_id: number
  entity_type: 'lead' | 'contact' | 'company'
  created_by: number
  created_at: number
  updated_at?: number
  value_after?: unknown[]
  value_before?: unknown[]
  account_id: number
  _embedded: EventEmbedded
}

export interface EventEmbedded {
  entity: EmbeddedEntity
}

export interface EmbeddedEntity {
  id: number
}

export interface EventValue {
  task?: {
    text: string
  }
  helpbot?: {
    id: number
  }
  transaction?: {
    id: number
  }
  note?: {
    id: number
  }
  nps?: {
    rate: number
  }
  message?: {
    id: string
  }
  tag?: {
    name: string
  }
  lead_status?: {
    id: number
    pipeline_id: number
  }
  customer_status?: {
    id: number
  }
  link?: {
    entity: {
      type: 'lead' | 'contact' | 'company'
      id: number
    }
  }
  responsible_user?: {
    id: number
  }
  task_deadline?: {
    timestamp: number
  }
  task_type?: {
    id: number
  }
  custom_field_value?: {
    field_id: number
    field_type: number
    enum_id: number
    text: string
  }
}
