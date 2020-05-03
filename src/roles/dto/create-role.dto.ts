import { IsEnum } from 'class-validator';
import { RoleType } from '../enums/role-type.enum';

export class CreateRoleDto {
  @IsEnum(RoleType)
  readonly role: RoleType;

  readonly groupId: string;
}
