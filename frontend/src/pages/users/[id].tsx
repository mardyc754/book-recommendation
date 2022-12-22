import { Stack, CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import useAuthContext from 'hooks/useAuthContext';
import {
  getAllUsers,
  getUserByUsername,
  getUserBooks,
  getRecommendedBooks
} from 'features/BackendAPI';

import PageWrapper from 'components/PageWrapper/PageWrapper';
import PageHeader from 'components/PageHeader';
import BookInfo from 'components/BookInfo';

import { User } from 'types';

const UserPage = ({ username, id }: User) => {
  const { user } = useAuthContext();
  const userBooksQuery = useQuery({
    queryKey: ['userBooks'],
    queryFn: () => getUserBooks(username)
  });

  const recommendedBooksQuery = useQuery({
    queryKey: ['recommendedBooks'],
    queryFn: () => getRecommendedBooks(username)
  });

  const recommendedBooks = recommendedBooksQuery.data?.slice(0, 5);

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
        {!userBooksQuery.isLoading ? (
          userBooksQuery.data?.map((bookProps) => {
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

      <PageHeader title="Books recommended for you" />
      <Stack
        alignItems="center"
        justifyItems="center"
        sx={{ marginBottom: '32px' }}
      >
        {!recommendedBooksQuery.isLoading ? (
          recommendedBooks?.map((bookProps) => {
            return (
              <BookInfo
                key={`BookInfo-recommended-rated-${bookProps.ISBN}`}
                data={bookProps}
              />
            );
          })
        ) : (
          <CircularProgress />
        )}
      </Stack>
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
