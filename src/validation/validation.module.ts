import { Module } from '@nestjs/common';
import { GroupsModule } from '../groups/groups.module';
import { RolesModule } from '../roles/roles.module';
import { CollectionsModule } from '../collections/collections.module';
import { UserRolesValidator } from '../users/validators/roles.validator';
import { CollectionIdsValidator } from '../groups/validators/collection-ids.validator';

@Module({
  imports: [GroupsModule, RolesModule, CollectionsModule],
  providers: [UserRolesValidator, CollectionIdsValidator],
})
export class ValidatorModule {}
