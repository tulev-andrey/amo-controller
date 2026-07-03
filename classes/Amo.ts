import axios, { AxiosInstance } from 'axios'
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
import { Logger } from '../types/logs.js'
import qs from 'qs'

export default class Amo {
  public instance: AxiosInstance
  private limiter: Bottleneck
  constructor(
    private baseURL: string,
    private token: string,
    public readonly options?: { rps?: number; logs?: { customLogger?: Logger; throwErrors?: boolean } },
  ) {
    const rps = this.options?.rps || 6
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
  }

  public leads = new Leads(this)
  public contacts = new Contacts(this)
  public companies = new Companies(this)
  public notes = {
    leads: new Notes(this, 'leads'),
    contacts: new Notes(this, 'contacts'),
    companies: new Notes(this, 'companies'),
  }
  public tasks = new Tasks(this)

  public pipelines = new Pipelines(this)
  public users = new Users(this)
  public loss_reasons = new LossReasons(this)
  public tags = {
    leads: new Tags(this, 'leads'),
    contacts: new Tags(this, 'contacts'),
    companies: new Tags(this, 'companies'),
  }
  public events = new Events(this)
}
