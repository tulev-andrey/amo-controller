import axios from 'axios';
import Bottleneck from 'bottleneck';
import Leads from './Leads';
import Companies from './Companies';
import Contacts from './Contacts';
import Users from './Users';
import Pipelines from './Pipelines';
import LossReasons from './LossReasons';
import Notes from './Notes';
import AxiosInstance = Axios.AxiosInstance;
import Tags from './Tags';
import Events from './Events';

export default class Amo {
  public instance: AxiosInstance;
  private limiter: Bottleneck;
  constructor(
    private baseURL: string,
    private token: string,
    private options?: { rps?: number },
  ) {
    const rps = this.options?.rps || 6;
    this.limiter = new Bottleneck({
      minTime: Math.ceil(1000 / rps),
      maxConcurrent: rps,
    });
    this.instance = axios.create({
      baseURL: this.baseURL,
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    });
    this.instance.interceptors.request.use(async (config) => {
      return this.limiter.schedule(async () => config);
    });
  }

  public leads = new Leads(this);
  public contacts = new Contacts(this);
  public companies = new Companies(this);
  public pipelines = new Pipelines(this);
  public users = new Users(this);
  public loss_reasons = new LossReasons(this);
  public notes = {
    leads: new Notes(this, 'leads'),
    contacts: new Notes(this, 'contacts'),
    companies: new Notes(this, 'companies'),
  };
  public tags = {
    leads: new Tags(this, 'leads'),
    contacts: new Tags(this, 'contacts'),
    companies: new Tags(this, 'companies'),
  };
  public events = new Events(this);
}
