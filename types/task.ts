export interface Task {
  id: number
  created_by: number
  updated_by: number
  created_at: number
  updated_at: number
  responsible_user_id: number
  group_id: number
  entity_id: number
  entity_type: 'leads' | 'contacts' | 'companies'
  duration: number
  is_completed: true
  task_type_id: number
  text: string
  result: { text?: string }
  complete_till: number
  account_id: number
}
