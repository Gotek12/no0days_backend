import { Request, Response } from 'express';
import User from '@src/model/user';

export const allUsers = (req: Request, res: Response) => {
  return User.find((err: any, users: any) => {
    if (err) {
      res.send(err);
    } else {
      res.send(users);
    }
  });
};

export const findUser = (req: Request, res: Response) => {
  return User.find({ name: req.params.userName }, (err: any, user: any) => {
    if (err) {
      res.send(err);
    } else {
      res.send(user);
    }
  });
};

export const addNewUser = (req: Request, res: Response) => {
  const user = new User(req.body);
  user.save((err: any) => {
    if (err) {
      res.send(err);
    } else {
      res.send(user);
    }
  });
};

export const deleteDBUser = (req: Request, res: Response) => {
  return User.findOneAndDelete({ name: req.params.userName }, (err: any) => {
    if (err) {
      res.send(err);
    } else {
      res.send('Successfully deleted user.');
    }
  });
};

export const updateDBUser = (req: Request, res: Response) => {
  return User.findByIdAndUpdate(
    req.params.userID,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    req.body,
    (err: any, user: any) => {
      if (err) {
        res.send(err);
      } else {
        res.send(user);
      }
    },
  );
};
