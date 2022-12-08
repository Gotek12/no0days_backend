import { NextFunction, Request, Response } from 'express';
import UserModel, { User } from '@src/model/userModel';
import mongoose from 'mongoose';

export const allUsers = async (req: Request, res: Response, next: NextFunction) => {
  const users = await UserModel.find();
  try {
    return users;
  } catch (error) {
    if (error) {
      next(error);
    }
  }
};

export const findUser = async (req: Request, res: Response, next: NextFunction) => {
  const users = await UserModel.find({ name: req.params.userName });
  try {
    return users;
  } catch (error) {
    if (error) {
      next(error);
    }
  }
};

export const addNewUser = async (req: Request, res: Response, next: NextFunction) => {
  const user = new UserModel(req.body);
  const ret = await user.save();

  try {
    return ret;
  } catch (error) {
    if (error) {
      next(error);
    }
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const ret = await UserModel.findOneAndDelete({ name: req.params.userName });

  try {
    return ret;
  } catch (error) {
    if (error) {
      next(error);
    }
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const ret = await UserModel.findByIdAndUpdate(req.params.userID, req.body);

  try {
    return ret;
  } catch (error) {
    if (error) {
      next(error);
    }
  }
};
/* eslint-enable */
