import axios, { AxiosResponse } from 'axios';
const BACKEND_BASE_URL = 'http://localhost:8080/';
import { BookDetails, User } from 'types';

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

export const createUser = async (
  username: string,
  password: string
): Promise<AxiosResponse<User>> => {
  return await fetcher.post(`/auth/register`, { username, password });
};
