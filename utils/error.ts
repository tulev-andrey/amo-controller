import { logger } from './logger'

export default function logError(name: string, error: any) {
  const err = {
    message: error.message,
    status: error.status,
    validation_errors: error.response?.data?.['validation-errors']?.[0]?.errors,
    error,
  }
  logger.error(name, err)
  console.error(name, err)
}
