import Amo from './Amo.js'
import EntityGetOnly from './base/EntityGetOnly.js'
import { Pipeline } from '../types/pipeline.js'
import { PipelineQueryParams } from '../types/query_params.js'

export default class Pipelines extends EntityGetOnly<'leads/pipelines', Pipeline, PipelineQueryParams> {
  constructor(protected amo: Amo) {
    super(amo, 'leads/pipelines')
  }
}
