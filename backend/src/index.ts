import App from './App';
import { AuthRouter, BookRouter, UserRouter } from 'routers';

const app = new App([new AuthRouter(), new BookRouter(), new UserRouter()]);

app.listen();
