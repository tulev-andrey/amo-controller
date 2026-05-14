import Amo from './Amo'
import EntityGetOnly from './base/EntityGetOnly'
import { LossReason } from '../types/loss_reason'
import { LossReasonQueryParams } from '../types/query_params'

export default class LossReasons extends EntityGetOnly<'leads/loss_reasons', LossReason, LossReasonQueryParams> {
  constructor(protected amo: Amo) {
    super(amo, 'leads/loss_reasons')
  }
}
