import { UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from '../base/base.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { IGroup } from './interfaces/group.interface';

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

  async create(groupInput: CreateGroupDto): Promise<IGroup> {
    if (this.canManage()) {
      const createdGroup = new this.groupModel(groupInput);
      return await createdGroup.save();
    }
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
      throw new UnauthorizedException();
    }

    await group.update(groupInput);
  }

  async remove(id: IGroup['_id']): Promise<boolean | void> {
    const group = await this.groupModel.findById(id);

    if (!group) {
      return false;
    }

    if (!this.canManage(id)) {
      throw new UnauthorizedException();
    }

    await group.remove();
  }

  canManage(id?: IGroup['_id']): boolean {
    if (!id) {
      return this.actor.numericRoleType <= 1;
    }

    return (
      this.actor.isGlobalManager ||
      (this.actor.numericRoleType <= 1 && this.actor.groups.includes(id))
    );
  }
}
