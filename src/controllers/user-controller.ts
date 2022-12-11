import express, { Request, Response, NextFunction } from 'express';
import { addNewUser, allUsers, findUser, deleteUser, updateUser } from '@src/services/user-service';

export const userRoute = express.Router();

userRoute.get('/test', (req: Request, res: Response) => {
  res.send({ message: 'user-controller test' });
});

userRoute.get('/', async (req: Request, res: Response, next: NextFunction) => {
  allUsers().then((data) => {
    res.send(data);
  }).catch((error) => {
    next(error);
    res.sendStatus(422);
  });
});

userRoute.get('/:userName', async (req: Request, res: Response, next: NextFunction) => {
  findUser(req.params.userName).then((data) => {
    res.send(data);
  }).catch((error) => {
    next(error);
    res.sendStatus(422);
  });
});

userRoute.post('/', async (req: Request, res: Response) => {
  await addNewUser(req)
    .then(() => {
      res.sendStatus(201);
    })
    .catch(() => {
      res.sendStatus(422);
    });
});

userRoute.delete('/:userName', async (req: Request, res: Response, next: NextFunction) => {
  deleteUser(req.params.userName).then((data) => {
    res.send(data);
  }).catch((error) => {
    next(error);
    res.sendStatus(422);
  });
});

userRoute.patch('/:userID', async (req: Request, res: Response, next: NextFunction) => {
  updateUser(req).then((data) => {
    res.send(data);
  }).catch((error) => {
    next(error);
    res.sendStatus(422);
  });
});
