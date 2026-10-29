import { EventQueryParams } from './../types/query_params.js'
import { Event } from './../types/events.js'
import Amo from './Amo.js'
import EntityGetOnly from './base/EntityGetOnly.js'

/**
 * Events (webhooks) management class.
 * Read-only access to account events feed.
 * @extends EntityGetOnly<'events', Event, EventQueryParams>
 */
export default class Events extends EntityGetOnly<'events', Event, EventQueryParams> {
  /**
   * Create a new Events manager.
   * @param amo - Parent Amo instance
   */
  constructor(protected readonly amo: Amo) {
    super(amo, 'events')
  }
}
