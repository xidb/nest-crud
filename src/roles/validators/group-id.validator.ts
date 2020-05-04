import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { IContextValidatonArguments } from '../../interceptors/interfaces/context-validation-arguments.interface';
import { IRole } from '../interfaces/role.interface';

@ValidatorConstraint()
export class GroupIdValidator implements ValidatorConstraintInterface {
  validate(
    groupId: IRole['groupId'],
    args: IContextValidatonArguments,
  ): boolean {
    const { isGlobalManager, groupMap } = args.object.context.user;

    if (isGlobalManager) {
      return true;
    }

    return Object.keys(groupMap).includes(groupId);
  }
}
