import axios, { AxiosResponse } from 'axios';
import { BookDetails } from 'types';

const BACKEND_BASE_URL = 'http://localhost:8080/';

const fetcher = axios.create({
  baseURL: BACKEND_BASE_URL,
  headers: {
    'Content-type': 'application/json'
    // 'Access-Control-Allow-Credentials': 'true'
    // 'Access-Control-Allow-Origin': 'http://localhost:8080'
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
