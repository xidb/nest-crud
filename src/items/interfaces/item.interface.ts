import { Document } from 'mongoose';
import { ICollection } from '../../collections/interfaces/collection.interface';

export interface IItem extends Document {
  readonly name: string;
  readonly parentId: ICollection['_id'];
}
