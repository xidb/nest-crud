import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RolesService } from '../../roles/roles.service';
import { IActor } from '../../users/interfaces/actor.interface';
import { UsersService } from '../../users/users.service';
import { jwtConstants } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly rolesService: RolesService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any): Promise<IActor> {
    const user = await this.usersService.findById(payload.sub);

    if (!user.roles.length) {
      throw new UnauthorizedException("You don't have any roles");
    }

    const actor = user.toObject({ versionKey: false });
    const roleMap = await this.rolesService.getRoleMap(user.roles);
    const groupMap = await this.rolesService.getGroupMap(user.roles);
    const isGlobalManager = await RolesService.isGlobalManager(roleMap);

    return { ...actor, roleMap, groupMap, isGlobalManager };
  }
}
