import { IGroup } from '../../groups/interfaces/group.interface';
import { IGroupMap } from '../../groups/interfaces/group-map.interface';
import { IRoleMap } from '../../roles/interfaces/role-map.interface';
import { IUser } from './user.interface';
import { IItem } from '../../items/interfaces/item.interface';

export interface IActor extends IUser {
  roleMap: IRoleMap;
  groupMap: IGroupMap;
  groups: IGroup['_id'][];
  collectionIds: IGroup['collectionIds'];
  itemIds: IItem['_id'];
  isGlobalManager: boolean;
  numericRoleType: number;
}
