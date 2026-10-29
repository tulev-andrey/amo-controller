import Amo from './Amo.js'
import { Company } from '../types/company.js'
import { DefaultQueryParams } from '../types/query_params.js'
import EntityWithCodeFields from './base/EntityWithCodeFields.js'
import { ArrayOfEntities } from './helpers/ArraysOfEntities.js'

/**
 * Companies entity manager for AmoCRM API.
 * Supports searching by phone/email via getByCode method.
 * @extends EntityWithCodeFields
 */
export default class Companies extends EntityWithCodeFields<'companies', Company, DefaultQueryParams> {
  /**
   * Create a new Companies manager.
   * @param amo - Parent Amo instance for API access
   */
  constructor(protected readonly amo: Amo) {
    super(amo, 'companies', ArrayOfEntities)
  }
}
