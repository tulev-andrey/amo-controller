import axios, { AxiosInstance, type AxiosError } from 'axios'
import Bottleneck from 'bottleneck'
import Leads from './Leads.js'
import Companies from './Companies.js'
import Contacts from './Contacts.js'
import Users from './Users.js'
import Pipelines from './Pipelines.js'
import LossReasons from './LossReasons.js'
import Notes from './Notes.js'
import Tags from './Tags.js'
import Events from './Events.js'
import Tasks from './Tasks.js'
import Account from './Account.js'
import { Logger } from '../types/logs.js'
import { AmoOptions } from '../types/amo.js'
import CustomFields from './CustomFields.js'
import qs from 'qs'
import _ from 'lodash'

/**
 * Main client class for AmoCRM API v4.
 * Provides access to all entity managers (leads, contacts, companies, etc.)
 * with built-in rate limiting, retry logic, and configurable logging.
 *
 * @example
 * ```typescript
 * import Amo from 'amo-controller'
 *
 * const amo = new Amo('https://example.amocrm.ru', 'access_token', {
 *   rps: 6,
 *   logs: { throwErrors: false }
 * })
 *
 * const leads = await amo.leads.get({ limit: 50 })
 * ```
 */
export default class Amo {
  /** Axios instance configured with auth and base URL */
  public readonly instance: AxiosInstance
  private readonly limiter: Bottleneck
  constructor(
    private baseURL: string,
    private token: string,
    public readonly options?: AmoOptions,
  ) {
    const logger: Logger = options?.logs?.customLogger || console
    const rps = this.options?.rps || 6
    const retry = this.options?.retry || 3
    const maxRetryDelay = this.options?.maxRetryDelay || 30000

    if (options?.logs?.throwErrors === false) _.set(this, 'options.logs.throwErrors', false)
    else _.set(this, 'options.logs.throwErrors', true)

    this.limiter = new Bottleneck({
      minTime: Math.ceil(1000 / rps),
      maxConcurrent: rps,
    })
    this.instance = axios.create({
      baseURL: this.baseURL,
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      paramsSerializer: (params) => {
        return qs.stringify(params)
      },
    })
    this.instance.interceptors.request.use(async (config) => {
      return this.limiter.schedule(async () => config)
    })
    this.instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const config = error.config

        if (!config) {
          throw error
        }

        config.__retryCount ??= 1

        if (error.response?.status !== 401 && config.__retryCount <= retry) {
          config.__retryCount++
          const delay = Math.min(1000 * 2 ** config.__retryCount!, maxRetryDelay)

          logger.info(`Retrying request to ${config.url} in ${delay}ms (attempt ${config.__retryCount})`)

          await new Promise((resolve) => setTimeout(resolve, delay))
          return this.instance(config)
        }

        throw error
      },
    )
  }

  public readonly account = new Account(this)

  /** Leads (deals) management */
  public readonly leads = new Leads(this)
  /** Contacts management */
  public readonly contacts = new Contacts(this)
  /** Companies management */
  public readonly companies = new Companies(this)
  /** Notes management for different entity types */
  public readonly notes = {
    leads: new Notes(this, 'leads'),
    contacts: new Notes(this, 'contacts'),
    companies: new Notes(this, 'companies'),
  }
  /** Tasks management */
  public readonly tasks = new Tasks(this)

  /** Sales pipelines management */
  public readonly pipelines = new Pipelines(this)
  /** Users management */
  public readonly users = new Users(this)
  /** Loss reasons management */
  public readonly loss_reasons = new LossReasons(this)
  /** Tags management for different entity types */
  public readonly tags = {
    leads: new Tags(this, 'leads'),
    contacts: new Tags(this, 'contacts'),
    companies: new Tags(this, 'companies'),
  }
  public readonly custom_fields = {
    leads: new CustomFields(this, 'leads'),
    contacts: new CustomFields(this, 'contacts'),
    companies: new CustomFields(this, 'companies'),
  }
  /** Events (webhooks) management */
  public readonly events = new Events(this)
}
