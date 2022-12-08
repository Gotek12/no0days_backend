import express, { Request, Response, NextFunction } from 'express';
import { addNewUser, allUsers, findUser, deleteUser, updateUser } from '@src/service/user-service';

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
  await addNewUser(req, res, next)
    .then(() => {
      res.sendStatus(201);
    })
    .catch(() => {
      res.sendStatus(422);
    });
});

userRoute.delete('/:userName', async (req: Request, res: Response, next: NextFunction) => {
  res.send(await deleteUser(req, res, next));
});

userRoute.patch('/:userID', async (req: Request, res: Response, next: NextFunction) => {
  res.send(await updateUser(req, res, next));
});
