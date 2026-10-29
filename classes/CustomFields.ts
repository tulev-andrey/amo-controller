import { AccountCustomField } from '../types/custom_fields.js';
import { MainEntitiesType } from '../types/entity.js'
import { CustomFieldQueryParams } from '../types/query_params.js';
import Amo from './Amo.js'
import EntityGetOnly from './base/EntityGetOnly.js'

export default class CustomFields<S extends MainEntitiesType> extends EntityGetOnly<
  `${S}/custom_fields`,
  AccountCustomField,
  CustomFieldQueryParams
> {
  constructor(
    protected amo: Amo,
    protected entity: S,
  ) {
    super(amo, `${entity}/custom_fields`)
  }
}
