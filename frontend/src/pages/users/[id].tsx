import { Stack, Typography, CircularProgress } from '@mui/material';
import { useQuery } from 'react-query';
import useAuth from 'hooks/useAuth';
import {
  getAllUsers,
  getUserByUsername,
  getUserBooks
} from 'features/BackendAPI';

import PageWrapper from 'components/PageWrapper/PageWrapper';
import PageHeader from 'components/PageHeader';
import StarRating from 'components/StarRating';
import BookInfo from 'components/BookInfo';

import { BookDetails, User } from 'types';

const UserPage = ({ username, id }: User) => {
  const { user } = useAuth();
  const { isLoading, isError, data, error } = useQuery<BookDetails[]>(
    'userBooks',
    () => getUserBooks(username)
  );

  const isCurrentUserPage = user && user.username === username;

  const pageTitle = isCurrentUserPage
    ? 'Books rated by you'
    : `Books rated by ${username}`;

  return (
    <PageWrapper>
      <PageHeader title={pageTitle} />
      <Stack
        alignItems="center"
        justifyItems="center"
        sx={{ marginBottom: '32px' }}
      >
        {!isLoading ? (
          data?.map((bookProps) => {
            return (
              <BookInfo
                key={`BookInfo-rated-${bookProps.ISBN}`}
                data={bookProps}
              />
            );
          })
        ) : (
          <CircularProgress />
        )}
      </Stack>
      {/* <Stack
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
              <StarRating value={rating} UserPageId={ISBN} iconSize="large" />
              <Typography>
                Rating: {rating} ({numOfRatings.low})
              </Typography>
              <Typography>Your rating: 0</Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack> */}
      {/* tutaj może książki podobne do oglądanej */}
    </PageWrapper>
  );
};

export async function getStaticPaths() {
  const allUserPages = await getAllUsers();

  const paths = allUserPages.data.map((UserPage) => {
    return {
      params: {
        id: UserPage.username,
        UserPageData: UserPage
      }
    };
  });

  return {
    paths,
    fallback: false
  };
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const user = await getUserByUsername(params.id);

  return {
    props: {
      username: user.data.username,
      id: user.data.id
    }
  };
}

export default UserPage;
