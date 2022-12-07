import {Request, Response} from "express";
import {
  addNewUser,
  allUsers,
  findUser,
  deleteDBUser,
  updateDBUser,
} from "@src/service/user_service";


export const getUsers = (req: Request, res: Response) => {
  return allUsers(req, res);
};

export const getUser = (req: Request, res: Response) => {
  return findUser(req, res);
};

export const addUser =  (req: Request, res: Response) => {
  return addNewUser(req, res);
};

export const deleteUser = (req: Request, res: Response) => {
  return deleteDBUser(req, res);
};

export const updateUser = (req: Request, res: Response) => {
  return updateDBUser(req, res);
};

