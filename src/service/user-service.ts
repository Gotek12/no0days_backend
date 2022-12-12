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

export const findUser = async (email: string) => {
  return UserModel.find({ email });
};

export const addNewUser = async (name: string, password: string, email: string) => {
  if (!name || !password || !email) {
    if (!name) {
      throw 'Missing username.';
    }
    if (!password) {
      throw 'Missing password.';
    }
    if (!email) {
      throw 'Missing email.';
    }
    //   dodac zmienne do errorow i throw jeden zwiezly error mowiacy co brakuje
  } else {
    const user = await UserModel.find({ email });
    if (user.length == 1) {
      throw 'Email already used';
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    return UserModel.create({
      name: name,
      password: passwordHash,
      email: email,
      active: false,
    });
  }
};

export const deleteUser = async (email: string) => {
  const ret = await UserModel.deleteOne({ email });
  if (ret.deletedCount === 0) {
    throw 'User does not exist.';
  }
  return ret;
};

export const updateUser = async (email: any, name?: string, password?: string) => {
  if (password) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    password = passwordHash;
  }

  let userObj = {};
  if (!email.newEmail) {
    email.newEmail = email.email;
  }
  if (name) {
    userObj = { email: email.newEmail, name, password };
    console.log(name);
  } else {
    userObj = { email: email.newEmail, password };
  }
  console.log(userObj);
  const ret = await UserModel.updateOne({ email: email.email }, userObj);

  if (ret.modifiedCount === 0) {
    throw 'User does not exist.';
  }

  return ret;
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserModel.find({ email: req.body.email });
  const token = createToken(user);
  if (user.length == 0) {
    res.status(401).send('Incorrect email or password');
  } else {
    const cmp = await bcrypt.compare(req.body.password, user[0].password);
    if (cmp) {
      res.send(token);
    } else {
      res.status(401).send('Incorrect email or password');
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