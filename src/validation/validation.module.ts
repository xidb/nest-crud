import { Module } from '@nestjs/common';
import { RolesModule } from '../roles/roles.module';
import { UserRolesValidator } from '../users/validators/roles.validator';

@Module({
  imports: [RolesModule],
  providers: [UserRolesValidator],
})
export class ValidatorModule {}
