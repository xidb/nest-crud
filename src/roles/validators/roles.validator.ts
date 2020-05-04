import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { IContextValidatonArguments } from '../../interceptors/interfaces/context-validation-arguments.interface';
import { RolesService } from '../roles.service';

@ValidatorConstraint()
export class RolesValidator implements ValidatorConstraintInterface {
  constructor(private readonly rolesService: RolesService) {}

  async validate(
    roles: string[],
    args: IContextValidatonArguments,
  ): Promise<boolean> {
    const { isGlobalManager, roleMap } = args.object.context.user;

    try {
      for (const id of roles) {
        if (typeof id !== 'string') {
          return false;
        }

        const role = await this.rolesService.findById(id);
        if (!role) {
          return false;
        }
        if (!isGlobalManager) {
          if (!(await this.rolesService.hasAccess(roleMap, [id]))) {
            return false;
          }
        }
      }
    } catch (e) {
      return false;
    }

    return true;
  }
}
