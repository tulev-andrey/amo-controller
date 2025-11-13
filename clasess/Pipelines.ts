import Amo from './Amo'
import EntityGetOnly from './base/EntityGetOnly'
import { Pipeline } from '../types/pipeline'
import { PipelineQueryParams } from '../types/query_params'

export default class Pipelines extends EntityGetOnly<'pipelines', Pipeline, PipelineQueryParams> {
  constructor(protected amo: Amo) {
    super(amo, 'leads/pipelines')
  }
}
