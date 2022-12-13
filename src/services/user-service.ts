import { Request } from 'express';
import UserModel, { User } from '@src/models/userModel';
import bcrypt from 'bcrypt';
import { Provider } from '@src/models/provider';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const allUsers = async (): Promise<User[]> => {
  return UserModel.find();
};

export const findUserByEmail = async (email: string): Promise<any> => {
  return await UserModel.findOne({ email });
};

export const addNewUser = async (req: Request): Promise<User> => {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(req.body.password, salt);
  return UserModel.create({
    name: req.body.name,
    password: passwordHash,
    email: req.body.email,
    active: false,
  });
};

export const deleteUser = async (userName: string): Promise<any> => {
  return UserModel.findOneAndDelete({ name: userName });
};

export const updateUser = async (req: Request): Promise<any> => {
  return UserModel.findByIdAndUpdate(req.params.userID, req.body);
};

export const addNewUserByOauth = async (name: string, email: string): Promise<User> => {
  return UserModel.create({
    name,
    email,
    provider: Provider.GOOGLE,
    active: true,
    last_log_in: new Date(),
  });
};
