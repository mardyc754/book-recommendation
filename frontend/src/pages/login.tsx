import Image from 'next/image';
import { Inter } from '@next/font/google';
import styles from '../styles/Home.module.css';
import PageWrapper from '../components/PageWrapper';

const inter = Inter({ subsets: ['latin'] });

const Login = () => {
  return (
    <PageWrapper showLoginButton={false}>
      <div>
        <p>Login</p>
        <form>
          <p>Username:</p>
          <input type="text" name="username" />
          <p>Password:</p>
          <input type="password" name="password" />
          <input type="button" value="Login" />
        </form>
      </div>
    </PageWrapper>
  );
};

export default Login;
