import Image from 'next/image';
import { Inter } from '@next/font/google';
import styles from '../styles/Home.module.css';
import PageWrapper from '../components/PageWrapper/PageWrapper';

const inter = Inter({ subsets: ['latin'] });

const Register = () => {
  return (
    <PageWrapper showRegisterButton={false}>
      <div>
        <p>Register</p>
        <form>
          <p>Username:</p>
          <input type="text" name="username" />
          <p>Password:</p>
          <input type="password" name="password" />
          <p>Confirm password:</p>
          <input type="password" name="passwordConfirm" />
          <input type="button" value="Register" />
        </form>
      </div>
    </PageWrapper>
  );
};

export default Register;
