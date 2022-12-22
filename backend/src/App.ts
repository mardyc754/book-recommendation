import 'dotenv/config';
import cors from 'cors';
import express, { Express } from 'express';

import { AbstractRouter } from './routers';

export default class App {
  private app: Express;
  private port: string | number;

  constructor(routers: AbstractRouter[], port: string | number) {
    this.app = express();
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.json());
    this.app.use(cors());
    this.port = port;

    this.createRouters(routers);
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
