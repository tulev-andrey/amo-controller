import { EventQueryParams } from './../types/query_params.js'
import { Event } from './../types/events.js'
import Amo from './Amo.js'
import EntityGetOnly from './base/EntityGetOnly.js'

export default class Events extends EntityGetOnly<'events', Event, EventQueryParams> {
  constructor(protected amo: Amo) {
    super(amo, 'events')
  }
}
