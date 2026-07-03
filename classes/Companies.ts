import Amo from './Amo.js'
import { Company } from '../types/company.js'
import { DefaultQueryParams } from '../types/query_params.js'
import EntityWithCodeFields from './base/EntityWithCodeFields.js'

export default class Companies extends EntityWithCodeFields<'companies', Company, DefaultQueryParams> {
  constructor(protected amo: Amo) {
    super(amo, 'companies')
  }
}
