export type Book = {
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

export type User = {
  id: number;
  username: string;
  token: string;
};

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
