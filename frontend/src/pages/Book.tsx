import * as React from 'react';
import { useParams } from 'react-router';
import PageWrapper from 'components/PageWrapper';
import { getBookById, getAllBooks } from 'features/BackendAPI';
import { BookDetails } from 'types';

const Book = () => {
  const { id } = useParams();
  const [bookData, setBookData] = React.useState<Partial<BookDetails>>({});

  React.useEffect(() => {
    (async function getBook() {
      if (!id) return;
      const response = await getBookById(id);
      setBookData(response.data);
    })();
  }, [id]);

  console.log(bookData);
  return (
    <PageWrapper showLoginButton={false}>
      <div>
        <p>Book details</p>
        <p>ISBN: {bookData.ISBN}</p>
        <p>Title: {bookData.title}</p>
        <p>Author: {bookData.author}</p>
        <p>Year: {bookData.year?.low}</p>
        <p>Publisher: {bookData.publisher}</p>
        <p>
          Rating: {bookData.rating} ({bookData.numOfRatings?.low})
        </p>
        <img
          src={bookData.imageURL}
          alt={bookData.title}
          width={300}
          height={500}
        />
      </div>
    </PageWrapper>
  );
};

// export async function getStaticPaths() {
//   const allBooks = await getAllBooks();
//   const paths = allBooks.data.map((book) => {
//     return {
//       params: {
//         id: book.ISBN,
//         bookData: book
//       }
//     };
//   }); // lista idków książek
//   // console.log(paths.slice(0, 5));

//   return {
//     paths,
//     fallback: false
//   };
// }

// export async function getStaticProps({ params }: { params: { id: string } }) {
//   // Fetch necessary data for the blog post using params.id
//   const { data } = await getBookById(params.id);
//   console.log(data);
//   // const booksData = await (
//   //   await fetch('http://localhost:3000/api/hello')
//   // ).json();
//   // console.log(booksData.response);
//   // const booksData = {
//   //   params: {
//   //     id: '1',
//   //     name: 'test1'
//   //   }
//   // };

//   console.log(data);

//   return {
//     props: {
//       bookData: data
//     }
//   };
// }

export default Book;
