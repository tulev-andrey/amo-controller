import { logger } from './logger'

export default function logError(name: string, error: any, data?: any) {
  let errorStr: string
  try {
    errorStr = JSON.stringify(error, null, 2)
  } catch {
    errorStr = String(error)
  }
  const err = {
    message: error.message,
    status: error.status,
    validation_errors: error.response?.data?.['validation-errors']?.[0]?.errors,
    error,
    errorStr,
    data,
  }
  logger.error(name, err)
  console.error(name, err)
}
