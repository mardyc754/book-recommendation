import * as React from 'react';
import {
  Star as StarIcon,
  StarOutline as StarOutlineIcon,
  StarHalf as StarHalfIcon
} from '@mui/icons-material';
import { Stack, IconButton, IconProps } from '@mui/material';

import { getBookById, getAllBooks, BookDetails } from '../features/BackendAPI';

type StarRatingProps = {
  value: number;
  userValue?: number;
  numberOfStars?: number;
  iconSize?: 'small' | 'medium' | 'large';
  readOnly?: boolean;
};

const StarRating = ({
  value,
  userValue = 0,
  numberOfStars = 10,
  iconSize = 'medium',
  readOnly
}: StarRatingProps): JSX.Element => {
  const ratingFraction = value - Math.floor(value);
  const numOfContainedStars = Math.floor(value);
  const numOfHalfStars = ratingFraction > 0.25 ? 1 : 0;
  const numOfOutlinedStars =
    numberOfStars - numOfContainedStars - numOfHalfStars;

  const stars: JSX.Element[] = [];

  [...Array(numOfContainedStars)].forEach((i) => {
    stars.push(
      <IconButton sx={{ padding: 0 }} disabled={readOnly}>
        <StarIcon key={`star-${i}`} fontSize={iconSize} />
      </IconButton>
    );
  });

  [...Array(numOfHalfStars)].forEach((i) => {
    stars.push(
      <IconButton sx={{ padding: 0 }} disabled={readOnly}>
        <StarHalfIcon
          key={`star-${i + numOfContainedStars}`}
          fontSize={iconSize}
        />
      </IconButton>
    );
  });

  [...Array(numOfOutlinedStars)].forEach((i) => {
    stars.push(
      <IconButton sx={{ padding: 0 }} disabled={readOnly}>
        <StarOutlineIcon
          key={`star-${i + numOfContainedStars + numOfHalfStars}`}
          fontSize={iconSize}
        />
      </IconButton>
    );
  });

  return (
    <Stack flexDirection="row" padding="8px 0">
      {stars}
    </Stack>
  );
};

export default StarRating;
