import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { IGroup } from '../interfaces/group.interface';
import { GroupsService } from '../groups.service';
import { CollectionsService } from '../../collections/collections.service';

@ValidatorConstraint()
export class CollectionIdsValidator implements ValidatorConstraintInterface {
  constructor(
    private readonly groupsService: GroupsService,
    private readonly collectionsService: CollectionsService,
  ) {}

  async validate(
    collectionIds: IGroup['collectionIds'],
    args,
  ): Promise<boolean> {
    const groupId = args.object.context.params.id;
    const groups = await this.groupsService.findAllExceptIds([groupId]);

    try {
      for (const id of collectionIds) {
        if (typeof id !== 'string') {
          return false;
        }

        for (const { collectionIds } of groups) {
          if (collectionIds.includes(id)) {
            return false;
          }
        }

        const collection = await this.collectionsService.findById(id);
        if (!collection) {
          return false;
        }
      }
    } catch (e) {
      return false;
    }

    return true;
  }
}
