import { NextFunction, Request, Response } from 'express';
import UserModel from '@src/models/userModel';
import bcrypt from 'bcrypt';

export const allUsers = async () => {
  return UserModel.find();
};

export const findUserByEmail = async (email: string) => {
  return UserModel.find({ email });
};

export const findUser = async (userName: string) => {
  return UserModel.find({ name: userName });
};

export const addNewUser = async (req: Request) => {

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(req.body.password, salt);
  return UserModel.create({
      name: req.body.name,
      password: passwordHash,
      email: req.body.email
  });
};

export const deleteUser = async (userName: string) => {
  return UserModel.findOneAndDelete({ name: userName });
};

export const updateUser = async (req: Request) => {
  return UserModel.findByIdAndUpdate(req.params.userID, req.body);
};
