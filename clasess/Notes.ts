import Amo from './Amo'
import Entity from './base/Entity'
import { Note } from '../types/note'
import { SecondEntityType } from '../types/entity'
import { NoteQueryParams } from '../types/query_params'

export default class Notes<S extends SecondEntityType> extends Entity<'notes', Note, NoteQueryParams> {
  constructor(
    protected amo: Amo,
    protected entity: S,
  ) {
    super(amo, `${entity}/notes`)
  }
}
