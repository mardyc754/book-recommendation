import * as React from 'react';
// import styles from '../styles/Home.module.css';

type PageWrapperProps = {
  title?: string;
  showLoginButton?: boolean;
  showRegisterButton?: boolean;
  children?: React.ReactNode;
};

const PageWrapper = ({
  showLoginButton = true,
  showRegisterButton = true,
  title = 'Book Recommender',
  children
}: PageWrapperProps): JSX.Element => {
  return (
    <>
      <header>
        <h1>Book recommender</h1>
        {showLoginButton && <button>Log in</button>}
        {showRegisterButton && <button>Register</button>}
      </header>
      <main>{children}</main>
      <footer>&copy; 2022 Marta Dychała</footer>
    </>
  );
};

export default PageWrapper;
