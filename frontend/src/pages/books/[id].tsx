import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import { BookDetails, Rating } from 'types';

import useAuth from 'hooks/useAuth';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import {
  getBookById,
  getAllBooks,
  getBookUserRating
} from 'features/BackendAPI';
import StarRating from 'components/StarRating';

const Book = ({ data }: { data: BookDetails }) => {
  const [userRating, setUserRating] = React.useState<Rating | null>(null);

  const {
    ISBN,
    year,
    title,
    rating,
    numOfRatings,
    publisher,
    imageURL,
    author
  } = data;

  const { user } = useAuth();

  React.useEffect(() => {
    if (user) {
      (async function getUserRating() {
        const response = await getBookUserRating(ISBN, user.username);
        setUserRating(response.data);
      })();
    }
  }, [user]);

  return (
    <PageWrapper>
      <Stack>
        <Stack
          sx={{ padding: '24px' }}
          alignItems="center"
          justifyItems="center"
        >
          <h2>Book details</h2>
        </Stack>
        <Stack
          flexDirection="row"
          sx={{ padding: '40px', paddingBottom: '80px' }}
        >
          <Stack>
            <img src={imageURL} alt={title} width={300} height={450} />
          </Stack>
          <Stack sx={{ paddingLeft: '56px' }} display="grid">
            <Stack>
              <Typography>Title: {title}</Typography>
              <Typography>Author: {author}</Typography>
              <Typography>Year: {year.low}</Typography>
              <Typography>Publisher: {publisher}</Typography>
              <Typography>ISBN: {ISBN}</Typography>
              <StarRating value={rating} bookId={ISBN} iconSize="large" />
              <Typography>
                Rating: {rating} ({numOfRatings.low})
              </Typography>
              <Typography>Your rating: {userRating?.value}</Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      {/* tutaj może książki podobne do oglądanej */}
    </PageWrapper>
  );
};

export async function getStaticPaths() {
  const allBooks = await getAllBooks();
  const paths = allBooks.data.map((book) => {
    return {
      params: {
        id: book.ISBN,
        bookData: book
      }
    };
  });

  return {
    paths,
    fallback: false
  };
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const { data } = await getBookById(params.id);

  return {
    props: {
      data
    }
  };
}

export default Book;
