import Amo from './Amo';
import { SecondEntityType } from '../types/entity';
import { Tag } from '../types/tag';
import EntityGetOnly from './base/EntityGetOnly';

export default class Tags<S extends SecondEntityType> extends EntityGetOnly<
  'tags',
  Tag
> {
  constructor(
    protected amo: Amo,
    protected entity: S,
  ) {
    super(amo, `${entity}/tags`);
  }
}
