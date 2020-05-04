import { IsEnum, Validate } from 'class-validator';
import { RoleType } from '../enums/role-type.enum';
import { IsStringOrNull } from '../../validation-decorators/is-string-or-null.validator';
import { GroupIdValidator } from '../validators/group-id.validator';
import { RoleTypeValidator } from '../validators/role-type.validator';

export class CreateRoleDto {
  @IsEnum(RoleType)
  @Validate(RoleTypeValidator, {
    message: 'You cannot create role that is higher than yours',
  })
  readonly role: RoleType;

  @Validate(GroupIdValidator, {
    message: "You cannot create role in a group you don't belong to",
  })
  @IsStringOrNull('groupId', { message: 'groupId could be string or null' })
  readonly groupId: string;
}
