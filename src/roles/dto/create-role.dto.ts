import { IsEnum } from 'class-validator';
import { RoleType } from '../enums/role-type.enum';
import { IsStringOrNull } from '../../validation-decorators/is-string-or-null.validator';

export class CreateRoleDto {
  @IsEnum(RoleType)
  readonly role: RoleType;

  @IsStringOrNull('groupId', { message: 'groupId could be string or null' })
  readonly groupId: string;
}
