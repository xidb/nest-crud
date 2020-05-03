import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<IUser>) {}

  async findAll(): Promise<IUser[]> {
    return this.userModel.find().exec();
  }

  async create(userInput: CreateUserDto): Promise<IUser> {
    const createdUser = new this.userModel(userInput);
    return await createdUser.save();
  }

  async remove(id): Promise<boolean> {
    return (await this.userModel.findByIdAndDelete(id)) !== null;
  }
}
