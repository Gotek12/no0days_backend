import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';

import 'express-async-errors';
import logger from 'jet-logger';
import EnvVars from '@src/declarations/major/EnvVars';
import HttpStatusCodes from '@src/declarations/major/HttpStatusCodes';
import { NodeEnvs } from '@src/declarations/enums';
import { RouteError } from '@src/declarations/classes';
import connect from "@src/db-connect";
import {
  addUser,
  getUsers,
  getUser,
  deleteUser, updateUser,
} from "@src/controller/user-controller";

// Connect to mongoDB //
connect();

// **** Init express **** //

const app = express();

// **** Set basic express settings **** //

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser(EnvVars.cookieProps.secret));

// Show routes called in console during development
if (EnvVars.nodeEnv === NodeEnvs.Dev) {
  app.use(morgan('dev'));
}

// Security
if (EnvVars.nodeEnv === NodeEnvs.Production) {
  app.use(helmet());
}

// **** Add API routes **** //

// Setup error handler
app.use((
  err: Error,
  _: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  logger.err(err, true);
  let status = HttpStatusCodes.BAD_REQUEST;
  if (err instanceof RouteError) {
    status = err.status;
  }
  return res.status(status).json({ error: err.message });
});

// Nav to login pg by default
app.get('/', (_: Request, res: Response) => {
  res.json({"message": "hello"});
});

app.get('/users', (req: Request, res: Response) => {
  getUsers(req, res);
});

app.get('/users/:userName', (req: Request, res: Response) => {
  getUser(req, res);
});

app.post('/users', (req: Request, res: Response) => {
  addUser(req, res);
});

app.delete('/delete-user/:userName', (req: Request, res: Response) => {
  deleteUser(req, res);
});

app.patch("/users/:userID", (req: Request, res: Response) => {
  updateUser(req, res);
});

// **** Export default **** //
export default app;
