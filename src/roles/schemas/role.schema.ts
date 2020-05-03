import { Schema } from 'mongoose';
import { RoleType } from '../enums/role-type.enum';

export const RoleSchema = new Schema({
  role: {
    type: String,
    enum: Object.values(RoleType),
  },
  groupId: String,
});
