import { GetOnlyParams } from '../../types/query_params.js'
import Amo from '../Amo.js'
import {
  EntitiesGetOnlyType,
  type EntitiesGetOnlyByAt,
  type EntitiesGetOnlyByAtClass,
} from '../../types/entity_get_only.js'
import EntityGetOnly from './EntityGetOnly.js'

export default class EntityGetOnlyByAt<
    N extends EntitiesGetOnlyType,
    E extends EntitiesGetOnlyByAt,
    Q extends GetOnlyParams,
  >
  extends EntityGetOnly<N, E, Q>
  implements EntitiesGetOnlyByAtClass<E, Q>
{
  constructor(
    protected amo: Amo,
    protected type: N,
  ) {
    super(amo, type)
  }

  getNewest(entities: E[], by: 'created_at' | 'updated_at'): E {
    let newest = entities[0]
    for (const entity of entities) {
      if (!newest[by]) {
        newest = entity
        continue
      }
      if (!entity[by]) continue
      if (entity[by] > newest[by]) newest = entity
    }
    return newest
  }

  getOldest(entities: E[], by: 'created_at' | 'updated_at'): E {
    let oldest = entities[0]
    for (const entity of entities) {
      if (!oldest[by]) {
        oldest = entity
        continue
      }
      if (!entity[by]) continue
      if (entity[by] < oldest[by]) oldest = entity
    }
    return oldest
  }
}
