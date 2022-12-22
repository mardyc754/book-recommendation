import axios, { AxiosResponse } from 'axios';
import {
  BookDetails,
  User,
  Rating,
  AuthUser,
  LoginData,
  RegisterData
} from 'types';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

const fetcher = axios.create({
  baseURL: BACKEND_BASE_URL
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

export const getRecommendedBooks = async (
  username: string | undefined
): Promise<BookDetails[]> => {
  if (!username) return Promise.resolve([]);
  const response = await fetcher.get(`/books/user/${username}/recommended`);
  return response.data;
};

export const getBookById = async (isbn: string): Promise<BookDetails> => {
  const response = await fetcher.get(`/books/${isbn}`);
  return response.data;
};

export const register = async ({
  username,
  password,
  passwordConfirm
}: RegisterData): Promise<void> => {
  if (password !== passwordConfirm) {
    alert('Passwords do not match');
    return;
  }

  await fetcher
    .post(`/auth/register`, { username, password })
    .then((res) => {
      alert(`User account for ${res.data.username} created successfully`);
    })
    .catch((err) => {
      alert(err.response.data.message);
    });
};

export const login = async ({
  username,
  password
}: LoginData): Promise<void> => {
  await fetcher
    .post(`/auth/login`, { username, password })
    .then((res) => {
      if (res.data.token) {
        localStorage.setItem('user', JSON.stringify(res.data));
        alert('Successfully logged in');
        window.location.href = '/';
      }
      return res.data;
    })
    .catch((err) => {
      alert(err.response.data.message);
    });
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

export const getUserByUsername = async (username: string): Promise<User> => {
  const response = await fetcher.get(`/users/${username}`);
  return response.data;
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
  value: number | null,
  token: string | undefined
): Promise<void> => {
  if (!value) return;
  await fetcher.post(`/books/user/${username}/rate`, {
    ISBN,
    username,
    value,
    token
  });
};
