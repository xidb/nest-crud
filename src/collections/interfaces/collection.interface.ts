import { Document } from 'mongoose';

export interface ICollection extends Document {
  readonly name: string;
}
