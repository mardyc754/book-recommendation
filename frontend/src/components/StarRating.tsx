import * as React from 'react';
import { getBookById, getAllBooks } from '../features/BackendAPI';
import { BookDetails } from 'types';

type StarRatingProps = {
  value: number;
  userValue: number;
};

const StarRating = ({ value, userValue }: StarRatingProps): JSX.Element => {
  return <div></div>;
};

export default StarRating;
