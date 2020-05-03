import {
  ArrayUnique,
  IsEmail,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { RolesValidator } from '../../roles/validators/roles.validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsString({ each: true })
  @ArrayUnique()
  @Validate(RolesValidator, { message: 'Invalid role' })
  readonly roles: string[];
}
