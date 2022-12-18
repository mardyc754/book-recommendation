import * as React from 'react';
import PageWrapper from 'components/PageWrapper';
import { getBookById } from 'features/BackendAPI';
import { BookDetails } from 'types';

const Home = (): JSX.Element => {
  // const [bookData, setBookData] = React.useState<BookDetails[]>([]);

  // React.useEffect(() => {
  //   (async function getBook() {
  //     const bookResponse = await getBookById('0195153448');
  //     setBookData([bookResponse.data]);
  //   })();
  // }, []);

  return (
    <PageWrapper>
      <div>
        <h2>Welcome to Book recommender!</h2>
        <p>See which books we prepared for you:</p>
        <div>
          <p>Display:</p>
          <select defaultValue="popular">
            {/* tylko dla zalogowanych użytkowników */}
            {/* <option>Recommended for you</option> */}
            <option value="popular">Most popular</option>
            <option value="highestRated">Highest rated</option>
          </select>
        </div>
        <div className="BookList">{/* Tutaj lista książek */}</div>
      </div>
    </PageWrapper>
  );
};

export default Home;
