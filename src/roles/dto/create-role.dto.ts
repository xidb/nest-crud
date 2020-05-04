import { IsEnum, Validate } from 'class-validator';
import { ContextAwareDto } from '../../validation/context-aware.dto';
import { IsStringOrNull } from '../../validation/decorators/is-string-or-null.validator';
import { RoleType } from '../enums/role-type.enum';
import { GroupIdValidator } from '../validators/group-id.validator';
import { RoleTypeValidator } from '../validators/role-type.validator';

export class CreateRoleDto extends ContextAwareDto {
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
