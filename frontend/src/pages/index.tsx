import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Stack,
  Select,
  MenuItem,
  SelectChangeEvent,
  Typography
} from '@mui/material';

import PageWrapper from 'components/PageWrapper/PageWrapper';
import BookInfo from 'components/BookInfo';
import { CircularProgress } from '@mui/material';
import {
  getAllBooks,
  getPopularBooks,
  getHighestRatedBooks,
  getRecommendedBooks
} from '../features/BackendAPI';
import useAuthContext from 'hooks/useAuthContext';

enum DisplayOption {
  ALL = 'all',
  POPULAR = 'popular',
  HIGHEST_RATED = 'highestRated',
  RECOMMENDED = 'recommended'
}

export default function Home() {
  const { user } = useAuthContext();
  const optionQueries = new Map([
    [DisplayOption.ALL, getAllBooks],
    [DisplayOption.POPULAR, getPopularBooks],
    [DisplayOption.HIGHEST_RATED, getHighestRatedBooks],
    [DisplayOption.RECOMMENDED, () => getRecommendedBooks(user?.username)]
  ]);
  const [displayOption, setDisplayOption] = React.useState<DisplayOption>(
    user ? DisplayOption.RECOMMENDED : DisplayOption.ALL
  );

  const { isLoading, data } = useQuery({
    queryKey: [displayOption],
    queryFn: optionQueries.get(displayOption)
  });

  const booksData = data?.slice(0, 20);

  const handleDisplayOptionChange = (e: SelectChangeEvent) => {
    setDisplayOption(e.target.value as DisplayOption);
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
              defaultValue={
                user ? DisplayOption.RECOMMENDED : DisplayOption.ALL
              }
              sx={{ minWidth: '150px' }}
              onChange={handleDisplayOptionChange}
            >
              {user && (
                <MenuItem value={DisplayOption.RECOMMENDED}>
                  Recommended for you
                </MenuItem>
              )}
              <MenuItem value={DisplayOption.ALL}>All</MenuItem>
              <MenuItem value={DisplayOption.POPULAR}>Most popular</MenuItem>
              <MenuItem value={DisplayOption.HIGHEST_RATED}>
                Highest rated
              </MenuItem>
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
          {!isLoading &&
            booksData?.length === 0 &&
            displayOption === DisplayOption.RECOMMENDED && (
              <Typography>Rate more books to get recommendations</Typography>
            )}
        </Stack>
      </Stack>
    </PageWrapper>
  );
}
