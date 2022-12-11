import express, { Request, Response, NextFunction } from 'express';
import {
  addNewUser,
  allUsers,
  findUser,
  deleteUser,
  updateUser,
  loginUser,
  testToken,
} from '@src/service/user-service';

export const userRoute = express.Router();

userRoute.get('/test', (req: Request, res: Response) => {
  res.send({ message: 'user-controller test' });
});

userRoute.get('/', async (req: Request, res: Response, next: NextFunction) => {
  res.send(await allUsers(req, res, next));
});

userRoute.get('/:userName', async (req: Request, res: Response, next: NextFunction) => {
  res.send(await findUser(req, res, next));
});

userRoute.post('/', async (req: Request, res: Response, next: NextFunction) => {
  res.send(await addNewUser(req, res, next));
});

userRoute.delete('/:email', async (req: Request, res: Response, next: NextFunction) => {
  res.send(await deleteUser(req, res, next));
});

userRoute.patch('/:email', async (req: Request, res: Response, next: NextFunction) => {
  res.send(await updateUser(req, res, next));
});

userRoute.post('/signin', async (req: Request, res: Response, next: NextFunction) => {
  res.send(await loginUser(req, res, next));
});

userRoute.post('/tokenTest', async (req: Request, res: Response, next: NextFunction) => {
  res.send(await testToken(req, res, next));
});
