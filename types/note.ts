export interface Note {
  id: number;
  entity_id: number;
  created_by: number;
  updated_by: number;
  created_at: number;
  updated_at: number;
  responsible_user_id: number;
  group_id: number;
  note_type: string;
  params: {
    text: string;
  };
  account_id: number;
}
