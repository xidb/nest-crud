import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { GroupsService } from '../../groups/groups.service';
import { RolesService } from '../../roles/roles.service';
import { UsersService } from '../../users/users.service';
import { IActor } from '../../users/interfaces/actor.interface';
import { jwtConstants } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly groupsService: GroupsService,
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
    const roles = await this.rolesService.findByIds(user.roles);
    const roleMap = await this.rolesService.getRoleMap(roles);
    const groupMap = await this.groupsService.getGroupMap(roles);
    const groups = Object.keys(groupMap);
    const numericRoleType = RolesService.getNumericRoleType(roleMap);
    const isGlobalManager = RolesService.isGlobalManager(roleMap);

    return {
      ...actor,
      roleMap,
      groupMap,
      groups,
      numericRoleType,
      isGlobalManager,
    };
  }
}
