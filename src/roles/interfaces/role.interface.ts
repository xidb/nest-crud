import { Document } from 'mongoose';
import { RoleType } from '../enums/role-type.enum';

export interface IRole extends Document {
  readonly role: RoleType;
  readonly groupId: string;
}
