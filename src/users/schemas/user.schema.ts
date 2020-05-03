import { Schema } from 'mongoose';

export const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
  },
  roles: [String],
});
