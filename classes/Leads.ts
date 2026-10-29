import Amo from './Amo.js'
import { Lead } from '../types/lead.js'
import { DefaultQueryParams } from '../types/query_params.js'
import MainEntity from './base/MainEntity.js'
import { ArrayOfEntities } from './helpers/ArraysOfEntities.js'

/**
 * Leads (deals) management class.
 * Provides CRUD operations, linking, and custom field access for leads.
 * @extends MainEntity<'leads', Lead, DefaultQueryParams>
 */
export default class Leads extends MainEntity<'leads', Lead, DefaultQueryParams> {
  /**
   * Create a new Leads manager.
   * @param amo - Parent Amo instance
   */
  constructor(protected readonly amo: Amo) {
    super(amo, 'leads', ArrayOfEntities)
  }
}
