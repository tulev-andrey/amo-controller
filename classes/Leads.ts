import Amo from './Amo.js'
import { Lead } from '../types/lead.js'
import Entity from './base/Entity.js'
import { DefaultQueryParams } from '../types/query_params.js'

export default class Leads extends Entity<'leads', Lead, DefaultQueryParams> {
  constructor(protected amo: Amo) {
    super(amo, 'leads')
  }
}
