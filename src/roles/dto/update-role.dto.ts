import { IsEnum, IsOptional } from 'class-validator';
import { RoleType } from '../enums/role-type.enum';
import { IsStringOrNull } from '../../validation-decorators/is-string-or-null.validator';

export class UpdateRoleDto {
  @IsEnum(RoleType)
  @IsOptional()
  readonly role: RoleType;

  @IsOptional()
  @IsStringOrNull('groupId', { message: 'groupId could be string or null' })
  readonly groupId: string;
}
