import Image from 'next/image';
import styles from '../styles/Home.module.css';
import PageWrapper from '../../components/PageWrapper';

type BookData = {
  id: string;
  name: string;
};

const mockArray = [
  {
    params: {
      id: '1',
      name: 'test1'
    }
  },
  {
    params: {
      id: '2',
      name: 'test2'
    }
  }
];

const Book = ({ bookData }: { bookData: BookData }) => {
  console.log(bookData);
  return (
    <PageWrapper showLoginButton={false}>
      <div>
        <p>{bookData.id}</p>
        <p>{bookData.name}</p>
      </div>
    </PageWrapper>
  );
};

export async function getStaticPaths() {
  const paths = mockArray; // lista idków książek
  return {
    paths,
    fallback: false
  };
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  // Fetch necessary data for the blog post using params.id
  const bookData = mockArray[parseInt(params.id) - 1].params;
  // const booksData = await (
  //   await fetch('http://localhost:3000/api/hello')
  // ).json();
  // console.log(booksData.response);
  // const booksData = {
  //   params: {
  //     id: '1',
  //     name: 'test1'
  //   }
  // };

  return {
    props: {
      bookData
    }
  };
}

export default Book;
