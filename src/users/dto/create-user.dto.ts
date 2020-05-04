import {
  ArrayUnique,
  IsArray,
  IsEmail,
  IsString,
  Validate,
} from 'class-validator';
import { ContextAwareDto } from '../../validation/context-aware.dto';
import { UserRolesValidator } from '../validators/roles.validator';

export class CreateUserDto extends ContextAwareDto {
  @IsEmail()
  readonly email: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayUnique()
  @Validate(UserRolesValidator, { message: 'Invalid role' })
  readonly roles: string[];
}
