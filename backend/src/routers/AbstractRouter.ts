export default abstract class AbstractRouter {
  protected baseURL: string;

  constructor(newBaseURL: string) {
    this.baseURL = newBaseURL;
  }
}
