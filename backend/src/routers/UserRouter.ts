import { Request, Response } from 'express';
import UserService from '../services/UserService';
import AbstractRouter from './AbstractRouter';

export default class UserRouter extends AbstractRouter {
  private userService = new UserService();

  constructor() {
    super('/users');
    this.createRouters();
  }

  public createRouters(): void {
    this.router.get('/', this.getAllUsers);
    this.router.get('/:username', this.getUserByUsername);
  }

  private getAllUsers = async (_: Request, res: Response): Promise<void> => {
    const books = await this.userService.getAllUsers();
    if (books !== null) {
      res.status(200).send(books);
    } else {
      res.status(400).send('Cannot get all books');
    }
  };

  private getUserByUsername = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { username } = req.params;
    const user = await this.userService.getUserByUsername(username);
    if (user !== null) {
      const { username, id } = user;
      res.status(200).send({ username, id });
    } else {
      res.status(400).send('Cannot get popular books');
    }
  };
}
