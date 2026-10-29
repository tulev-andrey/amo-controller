import { Logger } from './logs.js'

export type AmoOptions = {
  rps?: number
  logs?: { customLogger?: Logger; throwErrors?: boolean }
  retry?: number
  maxRetryDelay?: number
  limit?: number
}
