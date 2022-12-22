import * as bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../services';

import AbstractRouter from './AbstractRouter';
export default class AuthRouter extends AbstractRouter {
  private userService: UserService;
  constructor() {
    super('/auth');
    this.userService = new UserService();
    this.createRouters();
  }

  public createRouters(): void {
    this.router.post('/register', this.register);
    this.router.post('/login', this.login);
    this.router.post('/logout', this.logout);
  }

  private register = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    let user = await this.userService.getUserByUsername(username);

    if (user !== null) {
      res
        .status(409)
        .send({ message: 'User with given username already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    user = await this.userService.createUser(username, hashedPassword);

    res
      .status(201)
      .send({ username: user?.username, message: 'User created succesfully' });
  };

  private login = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).send({
        message: 'Empty username or password'
      });
    }

    const user = await this.userService.getUserByUsername(username);

    if (user === null) {
      res.status(400).send({ message: 'Wrong credentials' });
      return;
    }

    const isValidPassword = await bcrypt.compare(
      password,
      user.password as string
    );

    if (!isValidPassword) {
      res.status(400).send({ message: 'Wrong username or password' });
      return;
    }

    const token = jwt.sign(
      { username, password },
      process.env.TOKEN_KEY as string,
      {
        expiresIn: '2h'
      }
    );

    // res.cookie('jwt', token);
    res.status(200).send({
      token,
      message: 'Logged in',
      username: user.username,
      id: user.id
    });
  };

  private logout = (req: Request, res: Response): void => {
    // res.clearCookie('jwt');
    res.status(200).send({ message: 'Logged out', isAuthenticated: false });
  };
}
