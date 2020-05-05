import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CollectionsService } from '../../collections/collections.service';
import { IItem } from '../interfaces/item.interface';

@ValidatorConstraint()
export class ParentIdValidator implements ValidatorConstraintInterface {
  constructor(private readonly collectionsService: CollectionsService) {}

  async validate(parentId: IItem['parentId']): Promise<boolean> {
    try {
      return Boolean(await this.collectionsService.findById(parentId));
    } catch (e) {
      return false;
    }
  }
}
