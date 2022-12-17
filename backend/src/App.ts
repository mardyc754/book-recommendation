import express, { Express } from 'express';
import 'dotenv/config';

export default class App {
  private port = process.env.PORT || 8080;
  private app: Express;

  constructor() {
    this.app = express();
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Server listening on port: ${this.port}`);
    });
  }
}
