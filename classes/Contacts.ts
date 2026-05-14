import Amo from './Amo'
import { Contact } from '../types/contact'
import { DefaultQueryParams } from '../types/query_params'
import EntityWithCodeFields from './base/EntityWithCodeFields'

export default class Contacts extends EntityWithCodeFields<'contacts', Contact, DefaultQueryParams> {
  constructor(protected amo: Amo) {
    super(amo, 'contacts')
  }
}
