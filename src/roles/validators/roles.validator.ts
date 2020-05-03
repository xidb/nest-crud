import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { RolesService } from '../roles.service';

@ValidatorConstraint()
export class RolesValidator implements ValidatorConstraintInterface {
  constructor(private readonly rolesService: RolesService) {}

  async validate(roles: string[]): Promise<boolean> {
    try {
      for (const id of roles) {
        if (typeof id !== 'string') {
          return false;
        }

        const role = await this.rolesService.findById(id);
        if (!role) {
          return false;
        }
      }
    } catch (e) {
      return false;
    }

    return true;
  }
}
