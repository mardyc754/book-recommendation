import { RegisterData, LoginData } from 'types';
import { createUser, login, cookies } from './BackendAPI';

export const handleRegisterSubmit = async (
  values: RegisterData
): Promise<void> => {
  const { username, password, passwordConfirm } = values;
  if (password !== passwordConfirm) {
    alert('Passwords do not match');
    return;
  }

  await createUser(username, password)
    .then((res) => {
      alert(`User account for ${res.data.username} created successfully`);
    })
    .catch((err) => {
      alert(err.response.data.message);
    });
};

export const handleLoginSubmit = async (values: LoginData): Promise<void> => {
  const { username, password } = values;

  await login(username, password)
    .then((res) => {
      if (res.data.token) {
        localStorage.setItem('user', JSON.stringify(res.data));
        alert('Successfully logged in');
        window.location.href = '/';
      }
      return res.data;
    })
    .catch((err) => {
      alert(err.response.data.message);
    });
};
