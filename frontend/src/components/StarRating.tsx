import * as React from 'react';
import {
  Star as StarIcon,
  StarOutline as StarOutlineIcon,
  StarHalf as StarHalfIcon
} from '@mui/icons-material';
import { Stack, IconButton } from '@mui/material';

type StarRatingProps = {
  value: number;
  numberOfStars?: number;
  iconSize?: 'small' | 'medium' | 'large';
  readOnly?: boolean;
  bookId: string;
};

const StarRating = ({
  value,
  bookId,
  numberOfStars = 10,
  iconSize = 'medium',
  readOnly
}: StarRatingProps): JSX.Element => {
  const ratingFraction = value - Math.floor(value);
  const numOfContainedStars = Math.floor(value);
  const numOfHalfStars = ratingFraction > 0.25 ? 1 : 0;
  const numOfOutlinedStars =
    numberOfStars - numOfContainedStars - numOfHalfStars;

  const stars: (() => JSX.Element)[] = [];

  [...Array(numOfContainedStars)].forEach(() => {
    stars.push(() => (
      <IconButton sx={{ padding: 0 }} disabled={readOnly}>
        <StarIcon fontSize={iconSize} />
      </IconButton>
    ));
  });

  [...Array(numOfHalfStars)].forEach(() => {
    stars.push(() => (
      <IconButton sx={{ padding: 0 }} disabled={readOnly}>
        <StarHalfIcon fontSize={iconSize} />
      </IconButton>
    ));
  });

  [...Array(numOfOutlinedStars)].forEach(() => {
    stars.push(() => (
      <IconButton sx={{ padding: 0 }} disabled={readOnly}>
        <StarOutlineIcon fontSize={iconSize} />
      </IconButton>
    ));
  });

  return (
    <Stack flexDirection="row" padding="8px 0">
      {stars.map((Component, i) => {
        return <Component key={`star-${bookId}-${i}`} />;
      })}
    </Stack>
  );
};

export default StarRating;
