import * as React from 'react';
import PageWrapper from 'components/PageWrapper';
import { getBookById } from 'features/BackendAPI';
import { BookDetails } from 'types';

const Page404 = (): JSX.Element => {
  return (
    <PageWrapper>
      <div>
        <p>404 Not Found</p>
      </div>
    </PageWrapper>
  );
};

export default Page404;
