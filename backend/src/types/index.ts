export type Book = {
  ISBN: string;
  title: string;
  author: string;
  year: number;
  publisher: string;
  imageURL: string;
};

export type BookDetails = {
  numOfRatings: number;
  rating: number;
  userRating?: number;
} & Book;

export type Rating = {
  username: string;
  ISBN: string;
  value: number | null;
};

export type User = {
  id: string;
  username: string;
};

export type AuthUser = {
  password: string;
} & User;
