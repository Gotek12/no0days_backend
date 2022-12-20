import {NextFunction, Request, Response} from 'express';
import UserModel, { User } from '@src/models/userModel';
import bcrypt from 'bcrypt';
import { Provider } from '@src/models/provider';
import EnvVars from '@src/declarations/major/EnvVars';
import {createToken, JwtPayload, verifyToken} from "@src/middleware/auth";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const allUsers = async (): Promise<User[]> => UserModel.find();

export const findUser = async (email: string): Promise<any> => await UserModel.findOne({ email });

export const addNewUser = async (name: string, password: string, email: string): Promise<any> => {
  if (!name || !password || !email) {
    // TODO: Use https://express-validator.github.io/docs/ instead
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
    const user = await UserModel.findOne({ email });
    if (user) {
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

export const deleteUser = async (email: string, token: string | undefined): Promise<any> => {
  if (token === undefined) {
    return null;
  } else {
    const payload = verifyToken(token) as JwtPayload;

    if (payload.user.email === email) {
      const result = await UserModel.deleteOne({ email });
      return result.deletedCount;
    } else {
      throw '404';
    }
  }
};

export const updateUser = async (token: string | undefined, email: any, name?: string, password?: string): Promise<any> => {
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

  if (token === undefined) {
    return null;
  } else {
    const payload = verifyToken(token) as JwtPayload;

    if (payload.user.email === email.email) {
      const ret = await UserModel.updateOne({ email: email.email }, userObj);

      if (ret.modifiedCount === 0) {
        throw 'User does not exist.';
      }

      return ret;
    } else {
      throw '404';
    }
  }
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

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserModel.find({ email: req.body.email });
  const token = createToken(user[0]);
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
