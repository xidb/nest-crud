import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { asyncFilter } from '../util';
import { BaseService } from '../base/base.service';
import { GroupsService } from '../groups/groups.service';
import { IGroupMap } from '../groups/interfaces/group-map.interface';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleType } from './enums/role-type.enum';
import { IRole } from './interfaces/role.interface';
import { IRoleMap } from './interfaces/role-map.interface';
import { ForbiddenException } from '@nestjs/common';

export class RolesService extends BaseService {
  constructor(
    private readonly groupsService: GroupsService,

    @InjectModel('Role') private readonly roleModel: Model<IRole>,
  ) {
    super();
  }

  async findAll(): Promise<IRole[]> {
    const roles = await this.roleModel.find().exec();

    if (this.actor.isGlobalManager) {
      return roles;
    } else {
      return asyncFilter(roles, role =>
        this.canManage(this.actor.groupMap, [role]),
      );
    }
  }

  async findById(id: string): Promise<IRole> {
    return this.roleModel.findById(id);
  }

  async findByIds(ids: IRole['_id'][]): Promise<IRole[]> {
    return this.roleModel
      .find()
      .where('_id')
      .in(ids)
      .exec();
  }

  async create(roleInput: CreateRoleDto): Promise<IRole> {
    if (this.actor.numericRoleType > 1) {
      throw new ForbiddenException('Unsufficient role');
    }

    const createdRole = new this.roleModel(roleInput);
    return await createdRole.save();
  }

  async update(id: IRole['_id'], roleInput: UpdateRoleDto): Promise<boolean> {
    const role = await this.roleModel.findById(id);

    if (!role) {
      return false;
    }

    if (!(await this.canManage(this.actor.groupMap, [role]))) {
      throw new ForbiddenException('Insufficient role or no access to a group');
    }

    await role.update(roleInput);
  }

  async remove(id: IRole['_id']): Promise<boolean> {
    const role = await this.roleModel.findById(id);

    if (!role) {
      return false;
    }

    if (!(await this.canManage(this.actor.groupMap, [role]))) {
      throw new ForbiddenException('Insufficient role or no access to a group');
    }

    await role.remove();
  }

  async getRoleMap(roles: IRole[]): Promise<IRoleMap> {
    return roles.reduce((acc: IRoleMap, role: IRole) => {
      acc[role._id] = RolesService.convertRoleTypeToNumeric(role.role);
      return acc;
    }, {});
  }

  static convertRoleTypeToNumeric(roleType: IRole['role']): number {
    return Object.values(RoleType).indexOf(roleType);
  }

  static getNumericRoleType(roleMap: IRoleMap): number {
    return Math.min(...Object.values(roleMap));
  }

  static isGlobalManager(roleMap: IRoleMap): boolean {
    return RolesService.getNumericRoleType(roleMap) === 0;
  }

  async canManage(
    actorGroupMap: IGroupMap,
    rolesOrIds: IRole[] | IRole['_id'][],
  ): Promise<boolean> {
    if (!rolesOrIds.length) {
      return true;
    }

    const roles =
      typeof rolesOrIds[0] === 'object' && rolesOrIds[0]['_id']
        ? rolesOrIds
        : await this.findByIds(rolesOrIds);
    const resourceGroupMap = await this.groupsService.getGroupMap(roles);

    return RolesService.checkGroupAccess(actorGroupMap, resourceGroupMap);
  }

  private static checkGroupAccess(
    actorGroupMap: IGroupMap,
    resourceGroupMap: IGroupMap,
  ): boolean {
    for (const groupId in actorGroupMap) {
      if (!actorGroupMap.hasOwnProperty(groupId)) {
        continue;
      }

      if (!resourceGroupMap[groupId]) {
        continue;
      }

      if (actorGroupMap[groupId] <= resourceGroupMap[groupId]) {
        return true;
      }
    }

    return false;
  }
}
