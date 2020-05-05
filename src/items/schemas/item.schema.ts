import { Schema } from 'mongoose';

export const ItemSchema = new Schema({
  name: String,
  parentId: String,
});
