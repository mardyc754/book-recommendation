import 'dotenv/config';
import cors from 'cors';
import express, { Express } from 'express';
import session from 'express-session';

import { AbstractRouter, AuthRouter, BookRouter, UserRouter } from './routers';
import { BookService, UserService } from './services';

export default class App {
  private readonly port = process.env.PORT || 8080;

  private app: Express;

  constructor() {
    this.app = express();
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(
      session({
        secret: 'someverymisterioussecret',
        resave: true,
        saveUninitialized: true
      })
    );

    this.createRouters([new AuthRouter(), new BookRouter(), new UserRouter()]);
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Server listening on port: ${this.port}`);
    });
  }

  private createRouters(routers: AbstractRouter[]) {
    routers.forEach((router) => {
      this.app.use(router.baseURL, router.router);
    });
  }
}
