import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { GroupsModule } from '../groups/groups.module';
import { RolesModule } from '../roles/roles.module';
import { UsersModule } from '../users/users.module';
import { ItemsModule } from '../items/items.module';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    GroupsModule,
    RolesModule,
    UsersModule,
    ItemsModule,
    PassportModule,
    JwtModule.register({ secret: jwtConstants.secret }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
