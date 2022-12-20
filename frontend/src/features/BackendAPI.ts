import axios, { AxiosResponse } from 'axios';
import Cookies from 'universal-cookie';
import { BookDetails, User, RegisterResponseData, Rating } from 'types';

const BACKEND_BASE_URL = 'http://localhost:8080/';

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
): Promise<AxiosResponse<User>> => {
  return await fetcher.get(`/books/users/${username}`);
};

export const getBookUserRating = async (
  ISBN: string,
  username: string
): Promise<AxiosResponse<Rating>> => {
  return await fetcher.get(`/books/${ISBN}/${username}/rating`);
};

// export const getCurrentUser = async (): Promise<void> => {
//   await fetcher.get(`/auth/token`);
// };
