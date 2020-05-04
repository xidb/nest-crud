import { IsEnum, Validate } from 'class-validator';
import { RoleType } from '../enums/role-type.enum';
import { IsStringOrNull } from '../../validation-decorators/is-string-or-null.validator';
import { RoleTypeValidator } from '../validators/role-type.validator';

export class CreateRoleDto {
  @IsEnum(RoleType)
  @Validate(RoleTypeValidator, {
    message: 'You cannot create role that is higher than yours',
  })
  readonly role: RoleType;

  @IsStringOrNull('groupId', { message: 'groupId could be string or null' })
  readonly groupId: string;
}
