import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommandModule } from 'nestjs-command';
import { ValidatorModule } from './validation/validation.module';
import { AuthModule } from './auth/auth.module';
import { GroupsModule } from './groups/groups.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { CollectionsModule } from './collections/collections.module';
import { ItemsModule } from './items/items.module';
import { GlobalManagerSeed } from './seeds/global-manager.seed';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/test'),
    ValidatorModule,
    AuthModule,
    GroupsModule,
    RolesModule,
    UsersModule,
    CollectionsModule,
    ItemsModule,
    CommandModule,
  ],
  providers: [GlobalManagerSeed],
})
export class AppModule {}
