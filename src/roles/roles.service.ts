import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IRole } from './interfaces/role.interface';

@Injectable()
export class RolesService {
  constructor(@InjectModel('Role') private readonly roleModel: Model<IRole>) {}

  async findAll(): Promise<IRole[]> {
    return this.roleModel.find().exec();
  }

  async create(roleInput: CreateRoleDto): Promise<IRole> {
    const createdRole = new this.roleModel(roleInput);
    return await createdRole.save();
  }

  async update(id: string, roleInput: UpdateRoleDto): Promise<boolean> {
    return (await this.roleModel.findByIdAndUpdate(id, roleInput)) !== null;
  }

  async remove(id: string): Promise<boolean> {
    return (await this.roleModel.findByIdAndDelete(id)) !== null;
  }
}
