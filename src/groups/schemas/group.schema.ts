import { Schema } from 'mongoose';

export const GroupSchema = new Schema({
  name: String,
  collectionIds: [String],
});
