import Amo from './Amo'
import { Company } from '../types/company'
import Entity from './base/Entity'
import { DefaultQueryParams } from '../types/query_params'

export default class Companies extends Entity<'companies', Company, DefaultQueryParams> {
  constructor(protected amo: Amo) {
    super(amo, 'companies')
  }
}
