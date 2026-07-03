import Amo from './Amo.js'
import { Task } from '../types/task.js'
import Entity from './base/Entity.js'
import { TaskQueryParams } from '../types/query_params.js'

export default class Tasks extends Entity<'tasks', Task, TaskQueryParams> {
  constructor(protected amo: Amo) {
    super(amo, 'tasks')
  }
}
