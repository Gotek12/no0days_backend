import { NextFunction, Request, Response } from 'express';
import UserModel from '@src/model/userModel';
import bcrypt from 'bcrypt';

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
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(req.body.password, salt);
    return UserModel.create({
      name: req.body.name,
      password: passwordHash,
      email: req.body.email,
      active: req.body.active,
    });
  } catch (e) {
    res.status(500).send(e.toString());
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
