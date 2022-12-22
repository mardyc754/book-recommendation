import axios, { AxiosResponse } from 'axios';
import Cookies from 'universal-cookie';
import {
  BookDetails,
  User,
  RegisterResponseData,
  Rating,
  AuthUser
} from 'types';

const BACKEND_BASE_URL = 'http://localhost:8080/';

export const cookies = new Cookies();

const fetcher = axios.create({
  baseURL: BACKEND_BASE_URL,
  headers: {
    'Content-type': 'application/json'
  }
});

export const getAllBooks = async (): Promise<BookDetails[]> => {
  const response = await fetcher.get('/books');
  return response.data;
};

export const getPopularBooks = async (): Promise<BookDetails[]> => {
  const response = await fetcher.get('/books/popular');
  return response.data;
};

export const getHighestRatedBooks = async (): Promise<BookDetails[]> => {
  const response = await fetcher.get('/books/highestRated');
  return response.data;
};

export const getBookById = async (isbn: string): Promise<BookDetails> => {
  const response = await fetcher.get(`/books/${isbn}`);
  return response.data;
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
    window.location.href = '/';
  });
};

export const getCurrentUser = (): AuthUser | undefined => {
  const userString = localStorage.getItem('user');
  if (!userString) return;

  return JSON.parse(userString);
};

export const getAllUsers = async (): Promise<AxiosResponse<User[]>> => {
  return await fetcher.get('/users');
};

export const getUserByUsername = async (
  username: string
): Promise<AxiosResponse<User>> => {
  return await fetcher.get(`/users/${username}`);
};

export const getUserBooks = async (
  username: string
): Promise<BookDetails[]> => {
  const response = await fetcher.get(`/books/user/${username}`);
  return response.data;
};

export const getBookUserRating = async (
  ISBN: string,
  username: string | undefined
): Promise<Rating | null> => {
  if (!username) return null;

  const response = await fetcher.get(`/books/${ISBN}/${username}/rating`);
  return response.data;
};

export const rateBook = async (
  ISBN: string,
  username: string | undefined,
  value: number | null
  // token: string
): Promise<void> => {
  if (!value) return;
  await fetcher.post(`/books/user/${username}/rate`, {
    ISBN,
    username,
    value
    // token
  });
};

// export const getCurrentUser = async (): Promise<void> => {
//   await fetcher.get(`/auth/token`);
// };
