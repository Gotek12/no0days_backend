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

userRoute.get('/', async (req: Request, res: Response) => {
  res.send(await allUsers());
});

userRoute.get('/:email', async (req: Request, res: Response) => {
  findUser(req.params.email)
    .then((data) => {
      if (data.length == 0) {
        res.sendStatus(422);
      } else {
        res.send(data);
      }
    })
    .catch((error) => {
      next(error);
      res.sendStatus(422);
    });
});

userRoute.post('/', async (req: Request, res: Response) => {
  await addNewUser(req.body.name, req.body.password, req.body.email)
    .then(() => {
      res.sendStatus(201);
    })
    .catch((error) => {
      res.status(422).send(error);
    });
});

  deleteUser(req.params.email)
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      next(error);
      res.status(422).send(error);
    });
userRoute.delete('/:email', async (req: Request, res: Response) => {
});

userRoute.patch('/:email', async (req: Request, res: Response, next: NextFunction) => {
  const emailObj = {
    email: req.params.email,
    newEmail: req.body.email,
  };
  updateUser(emailObj, req.body.name, req.body.password)
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      next(error);
      res.status(422).send(error);
    });
});

userRoute.post('/signin', async (req: Request, res: Response, next: NextFunction) => {
  res.send(await loginUser(req, res, next));
});

userRoute.post('/tokenTest', async (req: Request, res: Response, next: NextFunction) => {
  res.send(await testToken(req, res, next));
});
