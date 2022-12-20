import * as React from 'react';
import { AuthContext } from '../providers/AuthProvider';

const useAuth = () => {
  const authContext = React.useContext(AuthContext);

  if (!authContext) {
    throw new Error('AuthContext has not been initialized');
  }

  return authContext;
};

export default useAuth;
