import Amo from './Amo.js'
import EntityGetOnly from './base/EntityGetOnly.js'
import { Pipeline } from '../types/pipeline.js'
import { PipelineQueryParams } from '../types/query_params.js'

/**
 * Sales pipelines management class.
 * Read-only access to lead pipelines and their statuses.
 * @extends EntityGetOnly<'leads/pipelines', Pipeline, PipelineQueryParams>
 */
export default class Pipelines extends EntityGetOnly<'leads/pipelines', Pipeline, PipelineQueryParams> {
  /**
   * Create a new Pipelines manager.
   * @param amo - Parent Amo instance
   */
  constructor(protected readonly amo: Amo) {
    super(amo, 'leads/pipelines')
  }
}
