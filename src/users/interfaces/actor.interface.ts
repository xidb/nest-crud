import { IGroupMap } from '../../roles/interfaces/group-map.interface';
import { IRoleMap } from '../../roles/interfaces/role-map.interface';
import { IUser } from './user.interface';

export interface IActor extends IUser {
  roleMap: IRoleMap;
  groupMap: IGroupMap;
  groups: string[];
  isGlobalManager: boolean;
  numericRoleType: number;
}
