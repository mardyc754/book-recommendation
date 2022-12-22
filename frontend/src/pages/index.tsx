import * as React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Stack, Select, MenuItem, SelectChangeEvent } from '@mui/material';

import PageWrapper from 'components/PageWrapper/PageWrapper';
import BookInfo from 'components/BookInfo';
import { CircularProgress } from '@mui/material';
import {
  getAllBooks,
  getPopularBooks,
  getHighestRatedBooks
} from '../features/BackendAPI';
import { BookDetails } from 'types';

enum DisplayOption {
  ALL = 'all',
  POPULAR = 'popular',
  HIGHEST_RATED = 'highestRated',
  RECOMMENDED = 'recommended'
}

const optionQuery = new Map([
  [DisplayOption.ALL, getAllBooks],
  [DisplayOption.POPULAR, getPopularBooks],
  [DisplayOption.HIGHEST_RATED, getHighestRatedBooks]
]);

export default function Home() {
  const queryClient = useQueryClient();

  const [displayOption, setDisplayOption] = React.useState<DisplayOption>(
    DisplayOption.ALL
  );

  const { isLoading, data } = useQuery({
    queryKey: ['books', displayOption],
    queryFn: optionQuery.get(displayOption)
  });

  const booksData = data?.slice(0, 20);

  const handleDisplayOptionChange = (e: SelectChangeEvent) => {
    setDisplayOption(e.target.value as DisplayOption);
    queryClient.invalidateQueries({ queryKey: ['books'] });
  };

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
            <Select
              defaultValue="all"
              sx={{ minWidth: '150px' }}
              onChange={handleDisplayOptionChange}
            >
              {/* tylko dla zalogowanych użytkowników */}
              {/* <MenuItem value="recommended">Recommended for you</MenuItem> */}
              <MenuItem value="all">All</MenuItem>
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
          {isLoading ? (
            <CircularProgress />
          ) : (
            booksData?.map((book) => {
              return (
                <BookInfo key={`Home-BookInfo-${book.ISBN}`} data={book} />
              );
            })
          )}
        </Stack>
      </Stack>
    </PageWrapper>
  );
}
