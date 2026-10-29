import { AxiosError } from 'axios'
import { Account, AccountQuery } from '../types/account.js'
import logError from '../utils/error.js'
import Amo from './Amo.js'

export default class Accounts {
  constructor(protected amo: Amo) {
    this.url = 'api/v4/account'
  }

  readonly url: string

  async get(params: AccountQuery = {}): Promise<Account | undefined> {
    try {
      const response = await this.amo.instance.get<Account>(this.url, { params })
      return response.data
    } catch (error) {
      logError(
        `get account error`,
        error,
        error instanceof AxiosError ? error.response?.data : null,
        this.amo.options?.logs?.customLogger,
      )
      if (this.amo.options?.logs?.throwErrors) throw error
      return
    }
  }
}
