import { EventQueryParams } from './../types/query_params'
import { Event } from './../types/events'
import Amo from './Amo'
import EntityGetOnly from './base/EntityGetOnly.js'

export default class Events extends EntityGetOnly<'events', Event, EventQueryParams> {
  constructor(protected amo: Amo) {
    super(amo, 'events')
  }
}
