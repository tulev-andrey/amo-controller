import { EventQueryParams } from './../types/query_params'
import Amo from './Amo'
import EntityGetOnly from './base/EntityGetOnly'

export default class Events extends EntityGetOnly<'events', Events, EventQueryParams> {
  constructor(protected amo: Amo) {
    super(amo, 'events')
  }
}
