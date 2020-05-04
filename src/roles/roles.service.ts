import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IActor } from '../users/interfaces/actor.interface';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleType } from './enums/role-type.enum';
import { IRole } from './interfaces/role.interface';
import { IRoleMap } from './interfaces/role-map.interface';
import { IGroupMap } from './interfaces/group-map.interface';
import { asyncFilter } from '../util';

@Injectable()
export class RolesService {
  constructor(@InjectModel('Role') private readonly roleModel: Model<IRole>) {}

  private actor: IActor;

  setActor(actor): void {
    if (!this.actor) {
      this.actor = actor;
    }
  }

  async findAll(): Promise<IRole[]> {
    const roles = await this.roleModel.find().exec();

    if (this.actor.isGlobalManager) {
      return roles;
    } else {
      return asyncFilter(roles, role =>
        this.hasGroupAccess(this.actor.groupMap, [role]),
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
    const createdRole = new this.roleModel(roleInput);
    return await createdRole.save();
  }

  async update(id: IRole['_id'], roleInput: UpdateRoleDto): Promise<boolean> {
    return (await this.roleModel.findByIdAndUpdate(id, roleInput)) !== null;
  }

  async remove(id: IRole['_id']): Promise<boolean> {
    return (await this.roleModel.findByIdAndDelete(id)) !== null;
  }

  async getRoleMap(roles: IRole[]): Promise<IRoleMap> {
    return roles.reduce((acc: IRoleMap, role: IRole) => {
      acc[role._id] = RolesService.convertRoleTypeToNumeric(role.role);
      return acc;
    }, {});
  }

  async getGroupMap(roles: IRole[]): Promise<IGroupMap> {
    return roles.reduce((acc: IGroupMap, role: IRole) => {
      if (role.groupId) {
        acc[role.groupId] = RolesService.convertRoleTypeToNumeric(role.role);
      }
      return acc;
    }, {});
  }

  private static convertRoleTypeToNumeric(roleType: IRole['role']): number {
    return Object.values(RoleType).indexOf(roleType);
  }

  static isGlobalManager(roleMap: IRoleMap): boolean {
    return Object.values(roleMap).includes(0);
  }

  async hasGroupAccess(
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
    const resourceGroupMap = await this.getGroupMap(roles);

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
