import Image from 'next/image';
import styles from '../styles/Home.module.css';
import PageWrapper from '../components/PageWrapper/PageWrapper';

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
