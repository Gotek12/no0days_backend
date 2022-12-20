import mongoose, { Schema, Document } from 'mongoose';
import { Provider } from '@src/models/provider';

export interface User extends Document {
  name: string;
  email: string;
  password?: string;
  active?: boolean;
}
const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  active: { type: Boolean, default: false },
  provider: { type: String, enum: Provider, default: Provider.LOCAL },
  created_at: { type: Date, default: new Date() },
  last_log_in: { type: Date, required: false },
});

const UserModel = mongoose.model<User>('User', UserSchema);
export default UserModel;
