type Book = {
  ISBN: string;
  title: string;
  author: string;
  year: { low: number; high: number };
  publisher: string;
  imageURL: string;
};

type BookDetails = {
  numOfRatings: { low: number; high: number };
  rating: number;
} & Book;

export default BookDetails;
