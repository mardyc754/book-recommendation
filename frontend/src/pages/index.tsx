import Image from 'next/image';
import { Inter } from '@next/font/google';
import styles from '../styles/Home.module.css';
import PageWrapper from '../components/PageWrapper';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
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
}
