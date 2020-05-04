import { IsEnum, IsOptional, Validate } from 'class-validator';
import { RoleType } from '../enums/role-type.enum';
import { IsStringOrNull } from '../../validation-decorators/is-string-or-null.validator';
import { RoleTypeValidator } from '../validators/role-type.validator';

export class UpdateRoleDto {
  @IsEnum(RoleType)
  @Validate(RoleTypeValidator, {
    message: 'You cannot set a role that is higher than yours',
  })
  @IsOptional()
  readonly role: RoleType;

  @IsOptional()
  @IsStringOrNull('groupId', { message: 'groupId could be string or null' })
  readonly groupId: string;
}
