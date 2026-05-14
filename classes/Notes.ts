import Amo from './Amo'
import Entity from './base/Entity'
import { Note } from '../types/note'
import { SecondEntityType } from '../types/entity'
import { NoteQueryParams } from '../types/query_params'
import logError from '../utils/error'
import { AxiosError } from 'axios'

export default class Notes<S extends SecondEntityType> extends Entity<`${S}/notes`, Note, NoteQueryParams> {
  constructor(
    protected amo: Amo,
    protected entity: S,
  ) {
    super(amo, `${entity}/notes`)
  }

  public pin(noteId: number) {
    try {
      return this.amo.instance.post(`${this.url}/${noteId}/pin`)
    } catch (error) {
      logError(
        `pin ${this.type} error`,
        error,
        error instanceof AxiosError ? error.response?.data : null,
        this.amo.options?.logs?.customLogger,
      )
      if (this.amo.options?.logs?.throwErrors) throw error
      return null
    }
  }

  public unpin(noteId: number) {
    try {
      return this.amo.instance.post(`${this.url}/${noteId}/unpin`)
    } catch (error) {
      logError(
        `unpin ${this.type} error`,
        error,
        error instanceof AxiosError ? error.response?.data : null,
        this.amo.options?.logs?.customLogger,
      )
      if (this.amo.options?.logs?.throwErrors) throw error
      return null
    }
  }
}
