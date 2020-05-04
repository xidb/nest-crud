import { Document } from 'mongoose';
import { IRoleMap } from '../../roles/interfaces/role-map.interface';

export interface IUser extends Document {
  readonly email: string;
  readonly roles: string[];
  roleMap?: IRoleMap;
}
