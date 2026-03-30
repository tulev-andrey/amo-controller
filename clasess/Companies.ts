import Amo from './Amo'
import { Company } from '../types/company'
import { DefaultQueryParams } from '../types/query_params'
import EntityWithCodeFields from './base/EntityWithCodeFields'

export default class Companies extends EntityWithCodeFields<'companies', Company, DefaultQueryParams> {
  constructor(protected amo: Amo) {
    super(amo, 'companies')
  }
}
