import Head from 'next/head';
import Image from 'next/image';
import { Inter } from '@next/font/google';

import PageWrapper from '../components/PageWrapper';
// import styles from '../styles/Home.module.css';

const inter = Inter({ subsets: ['latin'] });

export default function TestPage() {
  return (
    <PageWrapper>
      <div>
        <p>
          Get started by editing&nbsp;
          <code>pages/index.tsx</code>
        </p>
      </div>
    </PageWrapper>
  );
}
