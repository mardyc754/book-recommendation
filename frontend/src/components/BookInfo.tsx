import * as React from 'react';
import Link from 'next/link';
import { Stack, Button, Typography } from '@mui/material';
import { BookDetails } from 'types';
import StarRating from './StarRating';

type BookInfoProps = {
  data: BookDetails;
};

const BookInfo = ({ data }: BookInfoProps): JSX.Element => {
  const { imageURL, title, author, rating, numOfRatings, ISBN } = data;
  return (
    <Stack
      flexDirection="row"
      sx={{
        width: '80%',
        boxShadow: '5px 5px 20px #ccc',
        margin: '24px',
        backgroundColor: '#effefef',
        padding: '24px',
        boxSizing: 'content-box'
      }}
    >
      <div style={{ width: '100px', height: '150px' }}>
        <img
          src={imageURL}
          alt={title}
          width={100}
          height={150}
          style={{ padding: '8px' }}
        />
      </div>
      <Stack
        flex={1}
        flexDirection="row"
        sx={{ padding: '16px', paddingLeft: '32px' }}
      >
        <Stack flex={1}>
          <Typography sx={{ fontSize: '22px' }}>{title}</Typography>
          <p>{author}</p>
          <p>
            Rating: {rating} ({numOfRatings.low})
          </p>
          <StarRating bookId={ISBN} value={rating} iconSize="small" readOnly />
        </Stack>
        <Stack
          sx={{
            padding: '32px'
          }}
        >
          <Link href={`/books/${ISBN}`}>
            <Button variant="contained" sx={{ textTransform: 'none' }}>
              Details
            </Button>
          </Link>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default React.memo(BookInfo);
