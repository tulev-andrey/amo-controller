export interface QueryParams {
  with?: string[];
  query?: string | number;
  filter?: Filter;
  limit?: number;
  order?: {
    id?: Order;
    created_at?: Order;
    updated_at?: Order;
  };
}

type Filter = FilterLeads | FilterContacts | FilterCompanies;
type Order = 'asc' | 'desc';

export interface MainFilter {
  id?: number | number[];
  name?: string;
  created_by?: number | number[];
  updated_by?: number | number[];
  responsible_user_id?: number | number[];
  created_at?: FromTo;
  updated_at?: FromTo;
  closed_at?: FromTo;
  closest_task_at?: FromTo;
}

export interface FilterLeads extends MainFilter {
  price?: FromTo;
  statuses?: { pipeline_id: number; status_id: number }[];
  pipeline_id?: number | number[];
}

export interface FilterContacts extends MainFilter {}

export interface FilterCompanies extends MainFilter {}

type FromTo = {
  from: number;
  to: number;
};
