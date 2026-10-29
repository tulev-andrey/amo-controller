export interface CustomField {
  field_id?: number
  field_code?: 'PHONE' | 'EMAIL'
  values: {
    value: CustomFieldValue
    enum_id?: number
    enum_code?: string
  }[]
}

export type CustomFieldValue = string | number | boolean

export interface AccountCustomField {
  id: number
  name: string
  sort: number
  type: string
  is_predefined: boolean
  settings: null
  remind: null
  is_api_only: boolean
  group_id: null
  enums: null
  required_statuses: {
    status_id: number
    pipeline_id: number
  }[]
}
