import {
  ArrayUnique,
  IsEmail,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { UserRolesValidator } from '../validators/roles.validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsString({ each: true })
  @ArrayUnique()
  @Validate(UserRolesValidator, { message: 'Invalid role' })
  readonly roles: string[];
}
