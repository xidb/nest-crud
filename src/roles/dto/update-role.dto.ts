import { IsEnum, IsOptional, Validate } from 'class-validator';
import { RoleType } from '../enums/role-type.enum';
import { IsStringOrNull } from '../../validation-decorators/is-string-or-null.validator';
import { GroupIdValidator } from '../validators/group-id.validator';
import { RoleTypeValidator } from '../validators/role-type.validator';

export class UpdateRoleDto {
  @IsOptional()
  @IsEnum(RoleType)
  @Validate(RoleTypeValidator, {
    message: 'You cannot set a role that is higher than yours',
  })
  readonly role: RoleType;

  @IsOptional()
  @Validate(GroupIdValidator, {
    message: "You cannot set a group you don't belong to",
  })
  @IsStringOrNull('groupId', { message: 'groupId could be string or null' })
  readonly groupId: string;
}
