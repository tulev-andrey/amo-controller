import Amo from './Amo'
import Entity from './base/Entity'
import { Note } from '../types/note'
import { SecondEntityType } from '../types/entity'

export default class Notes<S extends SecondEntityType> extends Entity<'notes', Note> {
  constructor(
    protected amo: Amo,
    protected entity: S,
  ) {
    super(amo, `${entity}/notes`)
  }
}
