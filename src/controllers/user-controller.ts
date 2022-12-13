import express, { Request, Response } from 'express';
import { addNewUser, allUsers, deleteUser, updateUser, findUserByEmail } from '@src/services/user-service';

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

userRoute.get('/:email', async (req: Request, res: Response): Promise<any> => {
  findUserByEmail(req.params.email)
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      res.sendStatus(422);
    });
});

userRoute.post('/', async (req: Request, res: Response): Promise<any> => {
  await addNewUser(req)
    .then(() => {
      res.sendStatus(201);
    })
    .catch(() => {
      res.sendStatus(500);
    });
});

userRoute.delete('/:userName', async (req: Request, res: Response): Promise<any> => {
  deleteUser(req.params.userName)
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      res.sendStatus(500);
    });
});

userRoute.patch('/:userID', async (req: Request, res: Response): Promise<any> => {
  updateUser(req)
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      res.sendStatus(500);
    });
});
