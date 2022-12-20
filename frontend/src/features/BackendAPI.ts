import axios, { AxiosResponse } from 'axios';
import Cookies from 'universal-cookie';

const BACKEND_BASE_URL = 'http://localhost:8080/';
import { BookDetails, User, RegisterResponseData } from 'types';

export const cookies = new Cookies();

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
): Promise<AxiosResponse<RegisterResponseData>> => {
  return await fetcher.post(`/auth/register`, { username, password });
};

export const login = async (
  username: string,
  password: string
): Promise<AxiosResponse<User>> => {
  // 1,PerkySkylight55,kGhEzUkdwi9Y1S6e
  return await fetcher.post(`/auth/login`, { username, password });
};

export const logout = async (): Promise<void> => {
  await fetcher.post(`/auth/logout`).then(() => {
    localStorage.removeItem('user');
    location.reload();
  });
};

export const getCurrentUser = (): User | undefined => {
  const userString = localStorage.getItem('user');
  if (!userString) return;

  return JSON.parse(userString);
};

// export const getCurrentUser = async (): Promise<void> => {
//   await fetcher.get(`/auth/token`);
// };
