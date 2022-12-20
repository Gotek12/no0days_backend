import express, { NextFunction, Request, Response } from 'express';
import {
  addNewUser,
  allUsers,
  deleteUser,
  updateUser,
  findUser,
  loginUser,
  testToken,
} from '@src/services/user-service';
import { logger } from '@src/logger';

export const userRoute = express.Router();

userRoute.get('/test', (req: Request, res: Response) => {
  res.send({ message: 'user-controller test' });
});

userRoute.get('/', async (req: Request, res: Response): Promise<any> => {
  allUsers()
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      res.sendStatus(422);
    });
});

userRoute.get('/:email', async (req: Request, res: Response) => {
  findUser(req.params.email)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });
});

userRoute.post('/', async (req: Request, res: Response): Promise<any> => {
  await addNewUser(req.body.name, req.body.password, req.body.email)
    .then(() => {
      res.sendStatus(201);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

userRoute.delete('/:email', async (req: Request, res: Response) => {
  deleteUser(req.params.email, req.headers.authorization)
    .then((deletedCount) => {
      if (deletedCount === 1) {
        res.sendStatus(204);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

userRoute.patch('/:email', async (req: Request, res: Response, next: NextFunction) => {
  const emailObj = {
    email: req.params.email,
    newEmail: req.body.email,
  };
  updateUser(req.headers.authorization, emailObj, req.body.name, req.body.password)
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      next(error);
      res.status(422).send(error);
    });
});

userRoute.post('/signin', async (req: Request, res: Response) => {
  await loginUser(req.body.email, req.body.password).then(
    (token) => res.send({ token: token }),
    (error) => res.status(422).send({ message: error }),
  );
});

userRoute.post('/tokenTest', async (req: Request, res: Response) => {
  await testToken(req.headers).then(
    (data) => res.send(data),
    (error) => res.status(422).send({ message: error }),
  );
});
