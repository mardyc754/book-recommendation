import * as React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { Stack, Box, Button } from '@mui/material';
import { User } from 'types';
import { HeaderButton } from './styles';
import { useRouter } from 'next/router';
import useAuthContext from 'hooks/useAuthContext';
import { getCurrentUser, logout } from 'features/BackendAPI';

type PageWrapperProps = {
  title?: string;
  children?: React.ReactNode;
};

const PageWrapper = ({
  title = 'Book Recommender',
  children
}: PageWrapperProps): JSX.Element => {
  const { pathname } = useRouter();
  const { user, isLoading } = useAuthContext();

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Stack style={{ minHeight: '100vh' }}>
        <Stack
          component="header"
          flexDirection="row"
          justifyContent="space-between"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 1,
            padding: '24px',
            boxShadow: '0px 5px 5px #ccc',
            backgroundColor: '#fff'
          }}
        >
          <Box>
            <h1>Book recommender</h1>
          </Box>
          {!isLoading && (
            <Stack flexDirection="row" component="nav">
              {pathname !== '/' && (
                <Link href="/">
                  <HeaderButton variant="contained">Home page</HeaderButton>
                </Link>
              )}
              {user?.id && (
                <Link href={`/users/${user?.username}`}>
                  <HeaderButton variant="contained">Your books</HeaderButton>
                </Link>
              )}
              {pathname !== '/login' && !user?.id && (
                <Link href="/login">
                  <HeaderButton variant="contained">Log in</HeaderButton>
                </Link>
              )}
              {pathname !== '/register' && !user?.id && (
                <Link href="/register">
                  <HeaderButton variant="contained">Register</HeaderButton>
                </Link>
              )}
              {!['/register', '/login'].includes(pathname) && user?.id && (
                <HeaderButton variant="contained" onClick={logout}>
                  Log out
                </HeaderButton>
              )}
            </Stack>
          )}
        </Stack>
        <Stack component="main" flex="1">
          {children}
        </Stack>
        <Stack
          component="footer"
          flexDirection="row"
          justifyContent="space-between"
          style={{
            padding: '24px',
            boxShadow: '0px -5px 5px #ccc'
          }}
        >
          &copy; 2022 Marta Dychała
        </Stack>
      </Stack>
    </>
  );
};

export default PageWrapper;
