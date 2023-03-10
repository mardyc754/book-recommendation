export type Book = {
  ISBN: string;
  title: string;
  author: string;
  year: { low: number; high: number };
  publisher: string;
  imageURL: string;
};

export type BookDetails = {
  numOfRatings: number;
  rating: number;
  userRating?: number;
} & Book;

export type User = {
  id: number;
  username: string;
};

export type AuthUser = {
  token: string;
} & User;

export type LoginData = {
  username: string;
  password: string;
};

export type RegisterData = {
  passwordConfirm: string;
} & LoginData;

export type RegisterResponseData = {
  username: string;
  message: string;
};

export type Rating = {
  username: string;
  ISBN: string;
  value: number | null;
};
