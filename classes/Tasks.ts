import Amo from './Amo.js'
import { Task } from '../types/task.js'
import Entity from './base/Entity.js'
import { TaskQueryParams } from '../types/query_params.js'

/**
 * Tasks management class.
 * Provides CRUD operations for tasks across all entity types.
 * @extends Entity<'tasks', Task, TaskQueryParams>
 */
export default class Tasks extends Entity<'tasks', Task, TaskQueryParams> {
  /**
   * Create a new Tasks manager.
   * @param amo - Parent Amo instance
   */
  constructor(protected readonly amo: Amo) {
    super(amo, 'tasks')
  }
}
