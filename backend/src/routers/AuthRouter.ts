import * as bcrypt from 'bcryptjs';
import e, { Request, Response } from 'express';
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
    const { username, password, passwordConfirm } = req.body;

    if (password !== passwordConfirm) {
      res.status(400).send({ error: 'Passwords do not match' });
    }

    let user = await this.userService.getUserByUsername(username);

    if (user !== null) {
      res
        .status(409)
        .send({ error: 'User with given username already exists' });
    }

    user = await this.userService.createUser(username, password);
    // const hashedPassword = await bcrypt.hash(password, 8);
    // user = await this.userService.createUser(username, hashedPassword)
    res.status(201).send({ user, message: 'User created succesfully' });
  };

  private login = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).send({
        error: 'Empty username or password',
        isAuthenticated: false
      });
    }

    // // przeszukiwanie w grafowej bazie czy użytkownik istnieje
    // zwracany response
    const user = await this.userService.getUserByUsername(username);

    if (user === null) {
      res.status(400).send({ error: 'Wrong credentials' });
    }
    // // utworzenie tokenu i wysłanie go do frontendu
    const token = jwt.sign(
      { username, password },
      process.env.TOKEN_KEY as string,
      {
        expiresIn: '2h'
      }
    );

    // const cookieOptions = {
    //   expires: new Date(Date.now() + 120000 * 24 * 60 * 60 * 1000),
    //   httpOnly: true
    // };

    res.cookie('jwt', token);
    res
      .status(200)
      .send({ token, message: 'Logged in', isAuthenticated: true });
  };

  private logout = (req: Request, res: Response): void => {
    if (!req.cookies.get('jwt')) {
      res.status(405).send({ error: 'User not logged in' });
    }
    res.clearCookie('jwt');
    res.status(200).send({ message: 'Logged out', isAuthenticated: false });
  };
}
