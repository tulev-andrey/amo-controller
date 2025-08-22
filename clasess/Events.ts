import Amo from './Amo';
import EntityGetOnly from './base/EntityGetOnly';

export default class Events extends EntityGetOnly<'events', Events> {
  constructor(protected amo: Amo) {
    super(amo, 'events');
  }
}
