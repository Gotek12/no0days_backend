import { Request, Response } from 'express';
import UserModel, { User } from '@src/model/userModel';

export const allUsers = (req: Request, res: Response) => {
  return UserModel.find((err: any, users: User[]) => {
    if (err) {
      res.send(err);
    } else {
      res.send(users);
    }
  });
};

export const findUser = (req: Request, res: Response) => {
  return UserModel.find({ name: req.params.userName }, (err: any, user: User[]) => {
    if (err) {
      res.send(err);
    } else {
      res.send(user);
    }
  });
};

export const addNewUser = (req: Request, res: Response) => {
  const user = new UserModel(req.body);
  user.save((err: any) => {
    if (err) {
      res.send(err);
    } else {
      res.send(user);
    }
  });
};

export const deleteUser = (req: Request, res: Response) => {
  return UserModel.findOneAndDelete({ name: req.params.userName }, (err: any) => {
    if (err) {
      res.send(err);
    } else {
      res.send('Successfully deleted user.');
    }
  });
};

/* eslint-disable @typescript-eslint/no-unsafe-argument*/
export const updateUser = (req: Request, res: Response) => {
  return UserModel.findByIdAndUpdate(req.params.userID, req.body, (err: any, user: User) => {
    if (err) {
      res.send(err);
    } else {
      res.send(user);
    }
  });
};
/* eslint-enable */
