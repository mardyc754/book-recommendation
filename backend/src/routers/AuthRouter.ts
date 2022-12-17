import AbstractRouter from './AbstractRouter';

export default class AuthRouter extends AbstractRouter {
  constructor() {
    super('/auth');
  }
}
