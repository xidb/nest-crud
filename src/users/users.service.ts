import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
    return (await this.userModel.findByIdAndUpdate(id, userInput)) !== null;
  }

  async remove(id: IUser['_id']): Promise<boolean> {
    return (await this.userModel.findByIdAndDelete(id)) !== null;
  }
}
