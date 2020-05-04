import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { asyncFilter } from '../util';
import { RolesService } from '../roles/roles.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IActor } from './interfaces/actor.interface';
import { IUser } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<IUser>,
    private readonly rolesService: RolesService,
  ) {}

  private actor: IActor;

  setActor(actor): void {
    if (!this.actor) {
      this.actor = actor;
    }
  }

  async findAll(): Promise<IUser[]> {
    const users = await this.userModel.find().exec();
    if (this.actor.isGlobalManager) {
      return users;
    } else {
      return asyncFilter(users, ({ roles }) =>
        this.rolesService.hasGroupAccess(this.actor.groupMap, roles),
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
    const createdUser = new this.userModel(userInput);
    return await createdUser.save();
  }

  async update(id: IUser['_id'], userInput: UpdateUserDto): Promise<boolean> {
    const user = await this.userModel.findById(id);

    if (!user) {
      return false;
    }

    if (
      !(await this.rolesService.hasGroupAccess(this.actor.groupMap, user.roles))
    ) {
      throw new UnauthorizedException();
    }

    await user.update(userInput);
  }

  async remove(id: IUser['_id']): Promise<boolean | void> {
    const user = await this.userModel.findById(id);

    if (!user) {
      return false;
    }

    if (
      !(await this.rolesService.hasGroupAccess(this.actor.groupMap, user.roles))
    ) {
      throw new UnauthorizedException();
    }

    await user.remove();
  }
}
