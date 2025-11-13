export interface Event {
  id: string
  type: string
  entity_id: number
  entity_type: 'lead' | 'contact' | 'company'
  created_by: number
  created_at: number
  value_after?: any[]
  value_before?: any[]
  account_id: number
  _embedded: EventEmbedded
}

export interface EventEmbedded {
  entity: EmbeddedEntity
}

export interface EmbeddedEntity {
  id: number
}
