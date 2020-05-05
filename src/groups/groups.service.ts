import { ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from '../base/base.service';
import { RoleType } from '../roles/enums/role-type.enum';
import { IRole } from '../roles/interfaces/role.interface';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { IGroup } from './interfaces/group.interface';
import { IGroupMap } from './interfaces/group-map.interface';

export class GroupsService extends BaseService {
  constructor(
    @InjectModel('Group') private readonly groupModel: Model<IGroup>,
  ) {
    super();
  }

  async findAll(): Promise<IGroup[]> {
    const groups = await this.groupModel.find().exec();
    if (this.actor.isGlobalManager) {
      return groups;
    } else {
      return groups.filter(({ _id }) =>
        this.actor.groups.includes(_id.toString()),
      );
    }
  }

  async findByIds(ids: IGroup['_id']): Promise<IGroup[]> {
    return this.groupModel
      .find()
      .where('_id')
      .in(ids)
      .exec();
  }

  async findAllExceptIds(ids: IGroup['_id'][]): Promise<IGroup[]> {
    return this.groupModel.find({ _id: { $not: { $all: ids } } });
  }

  async create(groupInput: CreateGroupDto): Promise<IGroup> {
    if (!this.canManage()) {
      throw new ForbiddenException('Insufficient role');
    }

    const createdGroup = new this.groupModel(groupInput);
    return await createdGroup.save();
  }

  async createSeed(groupInput: CreateGroupDto): Promise<IGroup> {
    const createdGroup = new this.groupModel(groupInput);
    return await createdGroup.save();
  }

  async update(
    id: IGroup['_id'],
    groupInput: UpdateGroupDto,
  ): Promise<boolean> {
    const group = await this.groupModel.findById(id);

    if (!group) {
      return false;
    }

    if (!this.canManage(id)) {
      throw new ForbiddenException(
        "Insufficient role or resource doesn't belong to a group",
      );
    }

    await group.update(groupInput);
  }

  async remove(id: IGroup['_id']): Promise<boolean | void> {
    const group = await this.groupModel.findById(id);

    if (!group) {
      return false;
    }

    if (!this.canManage(id)) {
      throw new ForbiddenException(
        "Insufficient role or resource doesn't belong to a group",
      );
    }

    await group.remove();
  }

  canManage(id?: IGroup['_id']): boolean {
    if (!id || this.actor.isGlobalManager) {
      return this.actor.numericRoleType <= 1;
    }

    return this.actor.numericRoleType <= 1 && this.actor.groups.includes(id);
  }

  async getGroupMap(roles: IRole[]): Promise<IGroupMap> {
    const groupMap = {};

    await Promise.all(
      roles.map(async (role: IRole) => {
        const { groupId, role: roleType } = role;

        try {
          const group = await this.groupModel.findById(groupId);
          if (group) {
            groupMap[groupId] = GroupsService.convertRoleTypeToNumeric(
              roleType,
            );
          }
        } catch (_e) {}
      }),
    );

    return groupMap;
  }

  private static convertRoleTypeToNumeric(roleType: IRole['role']): number {
    return Object.values(RoleType).indexOf(roleType);
  }

  async getCollectionIds(
    ids: IGroup['_id'][],
  ): Promise<IGroup['collectionIds']> {
    const groups = await this.findByIds(ids);
    return groups.reduce((acc, { collectionIds }) => {
      collectionIds.forEach(id => {
        if (!acc.includes(id)) {
          acc.push(id);
        }
      });
      return acc;
    }, []);
  }
}
