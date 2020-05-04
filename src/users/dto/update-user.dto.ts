import {
  ArrayUnique,
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { ContextAwareDto } from '../../validation/context-aware.dto';
import { UserRolesValidator } from '../validators/roles.validator';

export class UpdateUserDto extends ContextAwareDto {
  @IsOptional()
  @IsEmail()
  readonly email: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @ArrayUnique()
  @Validate(UserRolesValidator, { message: 'Invalid role' })
  readonly roles: string[];
}
