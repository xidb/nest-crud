import { IsEnum, IsOptional } from 'class-validator';
import { RoleType } from '../enums/role-type.enum';

export class UpdateRoleDto {
  @IsEnum(RoleType)
  @IsOptional()
  readonly role: RoleType;

  @IsOptional()
  readonly groupId: string;
}
