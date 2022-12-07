import mongoose, {Schema, Document} from "mongoose";

export interface IUser extends Document{
  name: string,
  email: string,
  password: string,
  active: boolean,
}
const UserSchema: Schema = new Schema({
  name: { type: String, required: true},
  email: { type: String, required: true},
  password: { type: String, required: true},
  active: { type: Boolean, required: true},
});

const User = mongoose.model<IUser>("User", UserSchema);
export default User;