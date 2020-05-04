import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { IContextValidatonArguments } from '../../interceptors/interfaces/context-validation-arguments.interface';
import { IRole } from '../interfaces/role.interface';
import { RolesService } from '../roles.service';

@ValidatorConstraint()
export class RoleTypeValidator implements ValidatorConstraintInterface {
  validate(roleType: IRole['role'], args: IContextValidatonArguments): boolean {
    const { isGlobalManager, roleMap } = args.object.context.user;

    if (isGlobalManager) {
      return true;
    }

    const numericRoleType = RolesService.convertRoleTypeToNumeric(roleType);
    const actorNumericRoleType = RolesService.getNumericRoleType(roleMap);

    // Case when role type is not a valid enum handled by another validator
    if (numericRoleType === -1) {
      return true;
    }

    return actorNumericRoleType <= numericRoleType;
  }
}
