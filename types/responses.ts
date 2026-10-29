import { EntitiesType, type MainEntitiesType } from './entity.js'
import { EntitiesGetOnlyType } from '../types/entity_get_only.js'

export interface MainResponse<T extends MainEntitiesType, E> {
  _embedded: { [key in T]: E[] }
}
export interface Response<T extends EntitiesType, E> {
  _embedded: { [key in T]: E[] }
}
export interface ResponseGetOnly<T extends EntitiesGetOnlyType, E> {
  _embedded: { [key in T]: E[] }
}
export interface CreateResponse {
  id: number
  request_id: string
}
export interface UpdateResponse {
  id: number
  name: string
  updated_at: number
}
