import Amo from './Amo'
import { Lead } from '../types/lead'
import Entity from './base/Entity'
import { DefaultQueryParams } from '../types/query_params'

export default class Leads extends Entity<'leads', Lead, DefaultQueryParams> {
  constructor(protected amo: Amo) {
    super(amo, 'leads')
  }
}
