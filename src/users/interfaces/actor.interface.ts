import { IRoleMap } from '../../roles/interfaces/role-map.interface';
import { IUser } from './user.interface';

export interface IActor extends IUser {
  roleMap: IRoleMap;
  isGlobalManager: boolean;
}
