import { Request, Response, NextFunction } from 'express';
import BookService from '../services/BookService';
import AbstractRouter from './AbstractRouter';
import { verifyToken } from '../middlewares';
import { BookDetails } from '../types';
export default class BookRouter extends AbstractRouter {
  private bookService = new BookService();

  constructor() {
    super('/books');
    this.createRouters();
  }

  public createRouters(): void {
    this.router.get('/', this.getAllBooks);
    this.router.get('/popular', this.getPopularBooks);
    this.router.get('/highestRated', this.getHighestRatedBooks);
    this.router.get('/:id', this.getBookById);
    this.router.get('/:id/:username/rating', this.getBookUserRating);
    this.router.get('/user/:username', verifyToken, this.getUserBooks);
    this.router.get(
      '/user/:username/recommended',
      verifyToken,
      this.getRecommendedBooks
    );
    this.router.post('/user/:username/rate', verifyToken, this.rateBook);
    this.router.put('/user/:username/rate', verifyToken, this.changeBookRating);
    this.router.delete(
      '/user/:username/rate',
      verifyToken,
      this.deleteBookRating
    );
  }

  private getAllBooks = async (_: Request, res: Response): Promise<void> => {
    const books = await this.bookService.getAllBooks();
    if (books !== null) {
      res.status(200).send(books);
    } else {
      res.status(400).send('Cannot get all books');
    }
  };

  private getPopularBooks = async (
    _: Request,
    res: Response
  ): Promise<void> => {
    const books = await this.bookService.getPopularBooks();
    if (books !== null) {
      res.status(200).send(books);
    } else {
      res.status(400).send('Cannot get popular books');
    }
  };

  private getHighestRatedBooks = async (
    _: Request,
    res: Response
  ): Promise<void> => {
    const books = await this.bookService.getHighestRatedBooks();
    if (books !== null) {
      res.status(200).send(books);
    } else {
      res.status(400).send('Cannot get popular books');
    }
  };

  private getUserBooks = async (req: Request, res: Response): Promise<void> => {
    const { username } = req.params;
    const books = await this.bookService.getUserBooks(username);
    if (books !== null) {
      res.status(200).send(books);
    } else {
      res.status(400).send('Cannot get user books');
    }
  };

  private getBookUserRating = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { username, id } = req.params;
    const rating = await this.bookService.getBookUserRating(id, username);
    if (rating !== null) {
      res.status(200).send(rating);
    } else {
      res.status(400).send('Cannot get user rating');
    }
  };

  // TODO: najważniejszy endpoint w programie
  // od niego zależy czy skończę te studia lub nie
  private getRecommendedBooks = async (): Promise<void> => {};

  private getBookById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const username = req.query.username as string | undefined;

    const book = username
      ? await this.bookService.getBookByIdWithUserRating(id, username)
      : await this.bookService.getBookById(id);

    if (book !== null) {
      res.status(200).send(book);
    } else {
      res.status(400).send('Cannot get book by given id');
    }
  };
  private rateBook = async (req: Request, res: Response): Promise<void> => {
    const { username, ISBN, rating } = req.body;
    const saved = await this.bookService.rateBook(username, ISBN, rating);
    if (saved) {
      res.status(200).send();
    } else {
      res.status(400).send('Cannot get book by given id');
    }
  };
  private changeBookRating = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { username, ISBN, rating } = req.body;
    const saved = await this.bookService.changeBookRating(
      username,
      ISBN,
      rating
    );
    if (saved) {
      res.status(200).send();
    } else {
      res.status(400).send('Cannot change book rating');
    }
  };

  private deleteBookRating = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { username, ISBN } = req.body;
    const saved = await this.bookService.deleteBookRating(username, ISBN);
    if (saved) {
      res.status(200).send();
    } else {
      res.status(400).send('Cannot delete book rating');
    }
  };
}
