import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleType } from './enums/role-type.enum';
import { IRole } from './interfaces/role.interface';
import { IRoleMap } from './interfaces/role-map.interface';
import { IGroupMap } from './interfaces/group-map.interface';

@Injectable()
export class RolesService {
  constructor(@InjectModel('Role') private readonly roleModel: Model<IRole>) {}

  async findAll(): Promise<IRole[]> {
    return this.roleModel.find().exec();
  }

  async findById(id: string): Promise<IRole> {
    return this.roleModel.findById(id);
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

  async getRoleMap(ids: IRole['_id'][]): Promise<IRoleMap> {
    const roles = await this.findByIds(ids);

    return roles.reduce((acc: IRoleMap, role: IRole) => {
      acc[role._id] = RolesService.convertRoleTypeToNumeric(role.role);
      return acc;
    }, {});
  }

  async getGroupMap(ids: IRole['_id'][]): Promise<IGroupMap> {
    const roles = await this.findByIds(ids);

    return roles.reduce((acc: IGroupMap, role: IRole) => {
      if (role.groupId) {
        acc[role.groupId] = RolesService.convertRoleTypeToNumeric(role.role);
      }
      return acc;
    }, {});
  }

  private async findByIds(ids: IRole['_id'][]): Promise<IRole[]> {
    return this.roleModel
      .find()
      .where('_id')
      .in(ids)
      .exec();
  }

  private static convertRoleTypeToNumeric(roleType: IRole['role']): number {
    return Object.values(RoleType).indexOf(roleType);
  }

  static isGlobalManager(roleMap: IRoleMap): boolean {
    return Object.values(roleMap).includes(0);
  }

  async hasAccess(
    groupMap: IGroupMap,
    roleIds: IRole['_id'][],
  ): Promise<boolean> {
    if (!roleIds.length) {
      return true;
    }

    const resourceGroupMap = await this.getGroupMap(roleIds);

    for (const groupId in groupMap) {
      if (!groupMap.hasOwnProperty(groupId)) {
        continue;
      }

      if (!resourceGroupMap[groupId]) {
        continue;
      }

      if (groupMap[groupId] <= resourceGroupMap[groupId]) {
        return true;
      }
    }

    return false;
  }
}
