import { ArrayUnique, IsEmail, IsString, Validate } from 'class-validator';
import { RolesValidator } from '../../roles/validators/roles.validator';

export class CreateUserDto {
  @IsEmail()
  readonly email: string;

  @IsString({ each: true })
  @ArrayUnique()
  @Validate(RolesValidator, { message: 'Invalid role' })
  readonly roles: string[];
}
