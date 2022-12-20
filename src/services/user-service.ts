import { NextFunction, Request, Response } from 'express';
import UserModel, { User } from '@src/models/userModel';
import bcrypt from 'bcrypt';
import { Provider } from '@src/models/provider';
import EnvVars from '@src/declarations/major/EnvVars';
import { createToken, JwtPayload, verifyToken } from '@src/middleware/auth';
import { Errors } from '@src/declarations/errors';
import { IncomingHttpHeaders } from 'http';

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
  return null;
};

export const updateUser = async (
  token: string | undefined,
  email: any,
  name?: string,
  password?: string,
): Promise<any> => {
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

export const loginUser = async (email: string, password: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    UserModel.findOne({ email }).then(
      (user: any) => {
        if (user) {
          bcrypt.compare(password, user.password).then(
            (res: boolean) => (res ? resolve(createToken(user)) : reject(Errors.INCORRECT_EMAIL_OR_PASSWORD)),
            () => reject(Errors.INTERNAL_ERROR),
          );
        }
      },
      () => reject(Errors.INTERNAL_ERROR),
    );
  });
};

export const testToken = async (headers: IncomingHttpHeaders): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (headers.authorization) {
      const token = verifyToken(headers.authorization);
      if (token === Errors.INCORRECT_TOKEN) {
        reject(Errors.INCORRECT_TOKEN);
      } else {
        resolve(token);
      }
    }
    reject(Errors.MISSING_TOKEN);
  });
};
