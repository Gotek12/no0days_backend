import { NextFunction, Request, Response } from 'express';
import UserModel from '@src/model/userModel';
import bcrypt from 'bcrypt';
import { createToken, verifyToken } from '@src/middleware/auth';

export const allUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserModel.find();
    return users;
  } catch (error) {
    if (error) {
      next(error);
    }
  }
};

export const findUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserModel.find({ name: req.params.userName });
    if (users.length === 0) {
      res.status(404);
    } else {
      return users;
    }
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
  try {
    const ret = await UserModel.findOneAndDelete({ name: req.params.userName });
    res.status(200);
  } catch (error) {
    if (error) {
      next(error);
    }
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ret = await UserModel.findByIdAndUpdate(req.params.userID, req.body);
  } catch (error) {
    if (error) {
      next(error);
    }
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserModel.find({ email: req.body.email });
  const token = createToken(user);
  if (user.length == 0) {
    res.status(401).send('bad pass / email');
  } else {
    const cmp = await bcrypt.compare(req.body.password, user[0].password);
    if (cmp) {
      res.send(token);
    } else {
      res.status(401).send('bad pass / email');
    }
  }
};

export const testToken = async (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization === undefined) {
    res.status(403).send('Missing token.');
  } else {
    const token = await verifyToken(req.headers.authorization);

    if (token === 'error') {
      res.status(403).send('Incorrect token.');
    } else {
      return token;
    }
  }
};
