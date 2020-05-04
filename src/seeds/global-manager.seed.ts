import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { GroupsService } from '../groups/groups.service';
import { RolesService } from '../roles/roles.service';
import { UsersService } from '../users/users.service';
import { RoleType } from '../roles/enums/role-type.enum';

@Injectable()
export class GlobalManagerSeed {
  constructor(
    private readonly groupsService: GroupsService,
    private readonly rolesService: RolesService,
    private readonly usersService: UsersService,
  ) {}

  @Command({
    command: 'create:globalManager',
    describe: 'creates globalManager',
    autoExit: true,
  })
  async create(): Promise<void> {
    const { _id: groupId } = await this.groupsService.createSeed({
      name: 'Group 1',
      collectionIds: [],
    });

    const { _id: roleId } = await this.rolesService.create({
      role: RoleType.GLOBAL_MANAGER,
      groupId,
    });

    const email = 'globalManager@gmail.com';

    const user = await this.usersService.create({
      email,
      roles: [roleId],
    });

    console.info(user);
    console.log(
      `Global manager ${email} created, visit auth/login to get an access token`,
    );
  }
}
