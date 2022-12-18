import * as React from 'react';
import Link from 'next/link';
import { getBookById, getAllBooks, BookDetails } from '../features/BackendAPI';

type StarRatingProps = {
  value: number;
  userValue: number;
};

const StarRating = ({ value, userValue }: StarRatingProps): JSX.Element => {
  return <div></div>;
};

export default StarRating;
