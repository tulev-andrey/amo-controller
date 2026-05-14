export interface CustomField {
  field_id?: number
  field_code?: 'PHONE' | 'EMAIL'
  values:
    | {
        value?: unknown
        enum_id?: number
        enum_code?: string
      }[]
    | null
}
