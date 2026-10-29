export interface Logger {
  error: (...e: unknown[]) => void
  info: (...e: unknown[]) => void
}
