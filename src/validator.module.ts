import { Module } from '@nestjs/common';
import { RolesModule } from './roles/roles.module';
import { RolesValidator } from './roles/validators/roles.validator';

@Module({
  imports: [RolesModule],
  providers: [RolesValidator],
})
export class ValidatorModule {}
