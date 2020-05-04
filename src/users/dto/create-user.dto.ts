import { ArrayUnique, IsEmail, IsString, Validate } from 'class-validator';
import { UserRolesValidator } from '../validators/roles.validator';

export class CreateUserDto {
  @IsEmail()
  readonly email: string;

  @IsString({ each: true })
  @ArrayUnique()
  @Validate(UserRolesValidator, { message: 'Invalid role' })
  readonly roles: string[];
}
