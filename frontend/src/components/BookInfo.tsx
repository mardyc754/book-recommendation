import * as React from 'react';
import Link from 'next/link';
import { getBookById, getAllBooks, BookDetails } from '../features/BackendAPI';

type BookInfoProps = {
  bookData: BookDetails;
};

const BookInfo = ({ bookData }: BookInfoProps): JSX.Element => {
  const { imageURL, title, author, rating, numOfRatings, ISBN } = bookData;
  return (
    <div>
      <img src={imageURL} alt={title} width={300} height={500} />
      <p>{title}</p>
      <p>{author}</p>
      <p>
        Rating: {rating} ({numOfRatings.low})
      </p>
      <button>
        <Link href={`/books/${ISBN}`}>Details</Link>
      </button>
    </div>
  );
};

export default BookInfo;
