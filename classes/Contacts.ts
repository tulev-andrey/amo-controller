import Amo from './Amo.js'
import { Contact } from '../types/contact.js'
import { DefaultQueryParams } from '../types/query_params.js'
import EntityWithCodeFields from './base/EntityWithCodeFields.js'

export default class Contacts extends EntityWithCodeFields<'contacts', Contact, DefaultQueryParams> {
  constructor(protected amo: Amo) {
    super(amo, 'contacts')
  }
}
