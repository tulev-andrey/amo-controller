import { logger } from './logger'

export default function logError(name: string, error: any, data?: any, loggerInstance = logger): void {
  let errorStr: string
  try {
    errorStr = JSON.stringify(error, null, 2)
  } catch {
    errorStr = String(error)
  }
  const err = {
    message: error.message,
    status: error.status,
    validation_errors: error.response?.data?.['validation-errors']?.map((err) => err.errors),
    error,
    errorStr,
    data,
  }
  loggerInstance.error(name, err)
  console.error(name, err)
}
