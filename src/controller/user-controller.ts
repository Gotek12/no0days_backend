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

userRoute.post('/', async (req: Request, res: Response) => {
  await addNewUser(req.body.name, req.body.password, req.body.email)
    .then(() => {
      res.sendStatus(201);
    })
    .catch((error) => {
      res.status(422).send(error);
    });
});

userRoute.delete('/:email', async (req: Request, res: Response) => {
  // TODO: Add JWT authorization
  deleteUser(req.params.email).then((deletedCount) => {
    if (deletedCount === 1) {
      res.send(204);
    }
    res.send(404);
  });
});

//TODO: Add JWT authorization
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
