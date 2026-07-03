import Amo from './Amo.js'
import EntityGetOnly from './base/EntityGetOnly.js'
import { LossReason } from '../types/loss_reason.js'
import { LossReasonQueryParams } from '../types/query_params.js'

export default class LossReasons extends EntityGetOnly<'leads/loss_reasons', LossReason, LossReasonQueryParams> {
  constructor(protected amo: Amo) {
    super(amo, 'leads/loss_reasons')
  }
}
