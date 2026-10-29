import Amo from './Amo.js'
import Entity from './base/Entity.js'
import { Note } from '../types/note.js'
import { MainEntitiesType } from '../types/entity.js'
import { NoteQueryParams } from '../types/query_params.js'
import logError from '../utils/error.js'
import { AxiosError } from 'axios'

/**
 * Notes management for a specific entity type (leads, contacts, companies).
 * Provides CRUD operations plus pin/unpin functionality.
 * @template S - The parent entity type ('leads' | 'contacts' | 'companies')
 */
export default class Notes<S extends MainEntitiesType> extends Entity<`${S}/notes`, Note, NoteQueryParams> {
  /**
   * Create a new Notes manager for a specific entity type.
   * @param amo - Parent Amo instance
   * @param entity - Parent entity type ('leads', 'contacts', or 'companies')
   */
  constructor(
    protected readonly amo: Amo,
    protected readonly entity: S,
  ) {
    super(amo, `${entity}/notes`)
  }

  /**
   * Pin a note to the top of the entity's notes list.
   * @param noteId - ID of the note to pin
   * @returns Response from API or null on error (if throwErrors is false)
   */
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

  /**
   * Unpin a previously pinned note.
   * @param noteId - ID of the note to unpin
   * @returns Response from API or null on error (if throwErrors is false)
   */
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
