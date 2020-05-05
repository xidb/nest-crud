import { ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from '../base/base.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { ICollection } from './interfaces/collection.interface';

export class CollectionsService extends BaseService {
  constructor(
    @InjectModel('Collection')
    private readonly collectionModel: Model<ICollection>,
  ) {
    super();
  }

  async findAll(): Promise<ICollection[]> {
    const collections = await this.collectionModel.find().exec();
    if (this.actor.isGlobalManager) {
      return collections;
    } else {
      return collections.filter(({ _id }) =>
        this.actor.collectionIds.includes(_id.toString()),
      );
    }
  }

  async findById(id: string): Promise<ICollection> {
    return this.collectionModel.findById(id);
  }

  async create(collectionInput: CreateCollectionDto): Promise<ICollection> {
    if (!this.canManage()) {
      throw new ForbiddenException('Insufficient role');
    }

    const createdCollection = new this.collectionModel(collectionInput);
    return await createdCollection.save();
  }

  async update(
    id: ICollection['_id'],
    collectionInput: UpdateCollectionDto,
  ): Promise<boolean> {
    const collection = await this.collectionModel.findById(id);

    if (!collection) {
      return false;
    }

    if (!this.canManage(id)) {
      throw new ForbiddenException(
        "Insufficient role or resource doesn't belong to a group",
      );
    }

    await collection.update(collectionInput);
  }

  async remove(id: ICollection['_id']): Promise<boolean | void> {
    const collection = await this.collectionModel.findById(id);

    if (!collection) {
      return false;
    }

    if (!this.canManage(id)) {
      throw new ForbiddenException(
        "Insufficient role or resource doesn't belong to a group",
      );
    }

    await collection.remove();
  }

  canManage(id?: ICollection['_id']): boolean {
    if (!id || this.actor.isGlobalManager) {
      return this.actor.numericRoleType <= 1;
    }

    return (
      this.actor.numericRoleType <= 1 && this.actor.collectionIds.includes(id)
    );
  }
}
