import Amo from './Amo'
import { Task } from '../types/task'
import Entity from './base/Entity'
import { TaskQueryParams } from '../types/query_params'

export default class Tasks extends Entity<'tasks', Task, TaskQueryParams> {
  constructor(protected amo: Amo) {
    super(amo, 'tasks')
  }
}
