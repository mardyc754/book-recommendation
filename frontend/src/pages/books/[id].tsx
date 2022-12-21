import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Stack, Typography, CircularProgress } from '@mui/material';
import { BookDetails, Rating } from 'types';

import useAuth from 'hooks/useAuth';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import {
  getBookById,
  getAllBooks,
  getBookUserRating,
  rateBook
} from 'features/BackendAPI';
import StarRating from 'components/StarRating';

const Book = ({ bookData }: { bookData: BookDetails }) => {
  const {
    ISBN,
    year,
    title,
    rating,
    numOfRatings,
    publisher,
    imageURL,
    author
  } = bookData;

  const queryClient = useQueryClient();
  const { user } = useAuth();

  const bookQuery = useQuery('book', () => getBookById(ISBN));
  console.log(bookQuery.data);
  const userRatingQuery = useQuery('userRating', () =>
    getBookUserRating(ISBN, user?.username)
  );

  const changeRatingMutation = useMutation(
    (newRating: Rating): Promise<void> =>
      rateBook(
        newRating.ISBN,
        newRating.username,
        newRating.value,
        user?.token
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['userRating', 'book']);
      }
    }
  );
  // const [userRating, setUserRating] = React.useState(
  //   userRatingQuery.data?.value
  // );

  // const onChangeUserRating = (newRating: number): void => {
  //   setUserRating(newRating);
  // };

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
              <StarRating
                value={bookQuery.data?.rating ?? 0}
                bookId={ISBN}
                iconSize="large"
                onChangeUserRating={(newValue: number) => {
                  user &&
                    changeRatingMutation.mutate({
                      username: user?.username,
                      ISBN,
                      value: newValue
                    });
                }}
              />
              <Typography>
                Rating: {bookQuery.data?.rating} ({numOfRatings.low})
              </Typography>
              {userRatingQuery.isLoading && <CircularProgress />}
              <Typography>
                Your rating: {userRatingQuery.data?.value ?? 'No rating'}
              </Typography>
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
  const bookData = await getBookById(params.id);
  return {
    props: {
      bookData
    }
  };
}

export default Book;
