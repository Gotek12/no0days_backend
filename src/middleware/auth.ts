import jwt from 'jsonwebtoken';
import EnvVars from '@src/declarations/major/EnvVars';
import { User } from '@src/models/userModel';
import { Errors } from '@src/declarations/errors';

export interface JwtPayload {
  user: User;
}

export const createToken = (user: User) => {
  return jwt.sign({ user }, EnvVars.jwt.secret, {
    expiresIn: '1h',
  });
};

export const verifyToken = (token: string): JwtPayload | Errors => {
  const tokenArray = token.split(' ');
  if (tokenArray[0] === 'Berearer') {
    try {
      return jwt.verify(tokenArray[1], EnvVars.jwt.secret) as JwtPayload;
    } catch (error) {
      return Errors.INCORRECT_TOKEN;
    }
  }
  return Errors.INCORRECT_TOKEN;
};
