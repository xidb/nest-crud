import { ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from '../base/base.service';
import { asyncFilter } from '../util';
import { RolesService } from '../roles/roles.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser } from './interfaces/user.interface';

export class UsersService extends BaseService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<IUser>,
    private readonly rolesService: RolesService,
  ) {
    super();
  }

  async findAll(): Promise<IUser[]> {
    const users = await this.userModel.find().exec();
    if (this.actor.isGlobalManager) {
      return users;
    } else {
      return asyncFilter(users, ({ roles }) =>
        this.rolesService.canManage(this.actor.groupMap, roles),
      );
    }
  }

  async findById(id: IUser['_id']): Promise<IUser> {
    return this.userModel.findById(id);
  }

  async findOne(userInput: object): Promise<IUser> {
    return this.userModel.findOne(userInput);
  }

  async create(userInput: CreateUserDto): Promise<IUser> {
    if (!this.canManage()) {
      throw new ForbiddenException('Insufficient role');
    }

    const createdUser = new this.userModel(userInput);
    return await createdUser.save();
  }

  async update(id: IUser['_id'], userInput: UpdateUserDto): Promise<boolean> {
    const user = await this.userModel.findById(id);

    if (!user) {
      return false;
    }

    if (!(await this.canManage(user))) {
      throw new ForbiddenException(
        "Insufficient role or resource doesn't belong to a group",
      );
    }

    await user.update(userInput);
  }

  async remove(id: IUser['_id']): Promise<boolean | void> {
    const user = await this.userModel.findById(id);

    if (!user) {
      return false;
    }

    if (!(await this.canManage(user))) {
      throw new ForbiddenException(
        "Insufficient role or resource doesn't belong to a group",
      );
    }

    await user.remove();
  }

  async canManage(user?: IUser): Promise<boolean> {
    if (!user || this.actor.isGlobalManager) {
      return this.actor.numericRoleType <= 1;
    }

    return this.rolesService.canManage(this.actor.groupMap, user.roles);
  }
}
