import axios, { AxiosResponse } from 'axios';
const BACKEND_BASE_URL = 'http://localhost:8080/';

type Book = {
  ISBN: string;
  title: string;
  author: string;
  year: { low: number; high: number };
  publisher: string;
  imageURL: string;
};

export type BookDetails = {
  numOfRatings: { low: number; high: number };
  rating: number;
} & Book;

const fetcher = axios.create({
  baseURL: BACKEND_BASE_URL,
  headers: {
    'Content-type': 'application/json'
  }
});

export const getAllBooks = async (): Promise<AxiosResponse<BookDetails[]>> => {
  return await fetcher.get('/books');
};

export const getBookById = async (
  isbn: string
): Promise<AxiosResponse<BookDetails>> => {
  return await fetcher.get(`/books/${isbn}`);
};
