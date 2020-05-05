import { ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from '../base/base.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { IItem } from './interfaces/item.interface';
import { ICollection } from '../collections/interfaces/collection.interface';

export class ItemsService extends BaseService {
  constructor(
    @InjectModel('Item')
    private readonly itemModel: Model<IItem>,
  ) {
    super();
  }

  async findAll(): Promise<IItem[]> {
    const items = await this.itemModel.find().exec();
    if (this.actor.isGlobalManager) {
      return items;
    } else {
      return items.filter(({ _id }) =>
        this.actor.itemIds.includes(_id.toString()),
      );
    }
  }

  async create(itemInput: CreateItemDto): Promise<IItem> {
    if (!this.canManage()) {
      throw new ForbiddenException('Insufficient role');
    }

    const createdItem = new this.itemModel(itemInput);
    return await createdItem.save();
  }

  async update(id: IItem['_id'], itemInput: UpdateItemDto): Promise<boolean> {
    const item = await this.itemModel.findById(id);

    if (!item) {
      return false;
    }

    if (!this.canManage(id)) {
      throw new ForbiddenException(
        "Insufficient role or resource doesn't belong to a group",
      );
    }

    await item.update(itemInput);
  }

  async remove(id: IItem['_id']): Promise<boolean | void> {
    const item = await this.itemModel.findById(id);

    if (!item) {
      return false;
    }

    if (!this.canManage(id)) {
      throw new ForbiddenException(
        "Insufficient role or resource doesn't belong to a group",
      );
    }

    await item.remove();
  }

  canManage(id?: IItem['_id']): boolean {
    if (!id || this.actor.isGlobalManager) {
      return this.actor.numericRoleType <= 1;
    }

    return this.actor.numericRoleType <= 1 && this.actor.itemIds.includes(id);
  }

  async getItemIds(collectionIds: ICollection['_id'][]): Promise<IItem['_id']> {
    const items = await this.itemModel.find().exec();
    return items
      .filter(({ parentId }) => collectionIds.includes(parentId))
      .map(({ _id }) => _id.toString());
  }
}
