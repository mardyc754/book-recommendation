import { Home, Book, Page404 } from 'pages';
import { Route } from 'types';

const routes: Route[] = [
  {
    path: '/',
    exact: true,
    component: Home
  },
  {
    path: '/books/:id',
    exact: true,
    component: Book
  },
  {
    path: '*',
    exact: true,
    component: Page404
  }
];

export default routes;
