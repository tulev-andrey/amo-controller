import Amo from './Amo.js'
import { Contact } from '../types/contact.js'
import { DefaultQueryParams } from '../types/query_params.js'
import EntityWithCodeFields from './base/EntityWithCodeFields.js'
import { ArrayOfEntities } from './helpers/ArraysOfEntities.js'

/**
 * Contacts entity manager for AmoCRM API.
 * Supports searching by phone/email via getByCode method.
 * @extends EntityWithCodeFields
 */
export default class Contacts extends EntityWithCodeFields<'contacts', Contact, DefaultQueryParams> {
  /**
   * Create a new Contacts manager.
   * @param amo - Parent Amo instance for API access
   */
  constructor(protected readonly amo: Amo) {
    super(amo, 'contacts', ArrayOfEntities)
  }
}
