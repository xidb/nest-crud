import { Module } from '@nestjs/common';
import { GroupsModule } from '../groups/groups.module';
import { RolesModule } from '../roles/roles.module';
import { CollectionsModule } from '../collections/collections.module';
import { UserRolesValidator } from '../users/validators/roles.validator';
import { CollectionIdsValidator } from '../groups/validators/collection-ids.validator';
import { ParentIdValidator } from '../items/validators/parent-id.validator';

@Module({
  imports: [GroupsModule, RolesModule, CollectionsModule],
  providers: [UserRolesValidator, CollectionIdsValidator, ParentIdValidator],
})
export class ValidatorModule {}
