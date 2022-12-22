import * as React from 'react';
import { Stack, Typography } from '@mui/material';
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

const Book = ({ initialBookData }: { initialBookData: BookDetails }) => {
  const { user } = useAuth();
  const [bookData, setBookData] = React.useState(initialBookData);
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

  const [userRating, setUserRating] = React.useState<number | null>(null);

  React.useEffect(() => {
    setBookData(initialBookData);
    (async function getRating(): Promise<void> {
      const rating = await getBookUserRating(ISBN, user?.username);
      setUserRating(rating && rating.value);
    })();
  }, [user]);

  const onChangeUserRating = (newRating: number): void => {
    (async function rateBookByUser(): Promise<void> {
      await rateBook(ISBN, user?.username, newRating).then(() => {
        setUserRating(newRating);
      });

      const newBookData = await getBookById(ISBN);
      setBookData(newBookData);
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
          <Stack sx={{ paddingLeft: '56px' }} display="grid">
            <Stack>
              <Typography>Title: {title}</Typography>
              <Typography>Author: {author}</Typography>
              <Typography>Year: {year.low}</Typography>
              <Typography>Publisher: {publisher}</Typography>
              <Typography>ISBN: {ISBN}</Typography>
              <StarRating
                value={rating ?? 0}
                bookId={ISBN}
                iconSize="large"
                onChangeUserRating={onChangeUserRating}
              />
              <Typography>
                Rating: {rating} ({numOfRatings.low})
              </Typography>
              <Typography>Your rating: {userRating ?? 'No rating'}</Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
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
  const initialBookData = await getBookById(params.id);
  return {
    props: {
      initialBookData
    }
  };
}

export default Book;
