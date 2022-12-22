import App from './App';
import { AuthRouter, BookRouter, UserRouter } from './routers';

const port = process.env.PORT || 8080;

const app = new App(
  [new AuthRouter(), new BookRouter(), new UserRouter()],
  port
);

app.listen();
