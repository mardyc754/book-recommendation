import * as React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Stack, Typography, Button } from '@mui/material';
import { BookDetails } from 'types';

import useAuthContext from 'hooks/useAuthContext';
import PageWrapper from 'components/PageWrapper';
import { getBookById, getAllBooks, getBookUserRating, rateBook } from 'api';
import StarRating from 'components/StarRating';

const Book = ({ initialBookData }: { initialBookData: BookDetails }) => {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  const { ISBN, year, title, publisher, imageURL, author } = initialBookData;

  const userRatingQuery = useQuery({
    queryKey: ['book', user],
    queryFn: () => getBookUserRating(initialBookData.ISBN, user?.username)
  });

  const bookQuery = useQuery({
    queryKey: ['book', ISBN],
    queryFn: () => getBookById(ISBN)
  });

  const onChangeUserRating = (newRating: number): void => {
    (async function rateBookByUser(): Promise<void> {
      await rateBook(ISBN, user?.username, newRating, user?.token).then(() => {
        queryClient.invalidateQueries({ queryKey: ['book'] });
      });
    })();
  };

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
          <Stack
            sx={{
              paddingLeft: '56px'
            }}
            display="grid"
          >
            <Stack>
              <Typography>Title: {title}</Typography>
              <Typography>Author: {author}</Typography>
              <Typography>Year: {year.low}</Typography>
              <Typography>Publisher: {publisher}</Typography>
              <Typography>ISBN: {ISBN}</Typography>
              <StarRating
                value={bookQuery.data?.rating ?? initialBookData.rating}
                bookId={ISBN}
                iconSize="large"
                onChangeUserRating={onChangeUserRating}
                readOnly={!user}
              />
              <Typography>
                <>
                  Rating: {bookQuery.data?.rating ?? initialBookData.rating} (
                  {bookQuery.data?.numOfRatings ?? initialBookData.numOfRatings}
                  )
                </>
              </Typography>
              {user ? (
                <Typography>
                  Your rating: {userRatingQuery.data?.value ?? 'No rating'}
                </Typography>
              ) : (
                <Typography>You must sign up to rate this book</Typography>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </PageWrapper>
  );
};

export async function getStaticPaths() {
  const allBooks = await getAllBooks();
  const paths = allBooks.map((book) => {
    return {
      params: {
        id: book.ISBN
      }
    };
  });
  return {
    paths,
    fallback: false
  };
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const initialBookData = await getBookById(params.id);
  return {
    props: {
      initialBookData
    }
  };
}

export default Book;
