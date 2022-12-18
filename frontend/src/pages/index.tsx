import * as React from 'react';
import Image from 'next/image';
// import styles from '../styles/Home.module.css';
import { Stack, Select, MenuItem } from '@mui/material';

import PageWrapper from '../components/PageWrapper/PageWrapper';
import BookInfo from 'components/BookInfo';
import { BookDetails, getBookById, getAllBooks } from '../features/BackendAPI';

export default function Home({ books }: { books: BookDetails[] }) {
  return (
    <PageWrapper>
      <Stack>
        <Stack
          sx={{ padding: '24px' }}
          alignItems="center"
          justifyItems="center"
        >
          <h2>Welcome to Book recommender!</h2>
        </Stack>
        <Stack
          sx={{ padding: '24px' }}
          alignItems="center"
          justifyItems="center"
          flexDirection="row"
        >
          <div style={{ flex: 1 }}>
            <p>See which books we prepared for you:</p>
          </div>
          <Stack flexDirection="row">
            <span style={{ margin: '16px' }}>Display:</span>
            <Select defaultValue="popular" sx={{ minWidth: '150px' }}>
              {/* tylko dla zalogowanych użytkowników */}
              {/* <MenuItem value="recommended">Recommended for you</MenuItem> */}
              <MenuItem value="popular">Most popular</MenuItem>
              <MenuItem value="highestRated">Highest rated</MenuItem>
            </Select>
          </Stack>
        </Stack>

        <Stack
          alignItems="center"
          justifyItems="center"
          sx={{ marginBottom: '32px' }}
        >
          {books.map((book) => {
            return <BookInfo key={`Home-BookInfo-${book.ISBN}`} data={book} />;
          })}
        </Stack>
      </Stack>
    </PageWrapper>
  );
}

export async function getStaticProps() {
  const res = await getAllBooks();
  const books = res.data;

  return {
    props: {
      books
    }
  };
}
