import { Logger } from '../types/logs'
import { logger } from './logger'
import { isAxiosError } from 'axios'

export default function logError(name: string, error: unknown, data?: unknown, loggerInstance: Logger = logger): void {
  let errorStr: string
  try {
    errorStr = JSON.stringify(error, null, 2)
  } catch {
    errorStr = String(error)
  }
  const responseData = isAxiosError(error) ? error.response?.data : undefined
  const validationErrors =
    responseData &&
    typeof responseData === 'object' &&
    'validation-errors' in responseData &&
    Array.isArray((responseData as { 'validation-errors': unknown })['validation-errors'])
      ? (responseData as { 'validation-errors': ValidationErrors[] })['validation-errors'].map((err) => err.errors)
      : undefined

  const errorObj = {
    message: isAxiosError(error) ? error.message : error instanceof Error ? error.message : undefined,
    status: isAxiosError(error) ? error.status : undefined,
    validation_errors: validationErrors,
    error,
    errorStr,
    data,
  }
  loggerInstance.error(name, errorObj)
}

interface ValidationErrors {
  errors: ValidationError[]
}

interface ValidationError {
  code: string
  path: string
  detail: string
}
