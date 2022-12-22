import * as React from 'react';
import { AuthUser } from 'types';

type AuthContextValues = {
  user: AuthUser | undefined;
  isLoading: boolean;
  getCurrentUser: () => AuthUser | undefined;
};

export const AuthContext = React.createContext<AuthContextValues | undefined>(
  undefined
);

const AuthProvider = ({
  children
}: {
  children: React.ReactElement;
}): JSX.Element => {
  const [user, setUser] = React.useState<AuthUser>();
  const [isLoading, setIsLoading] = React.useState(true);

  const getCurrentUser = (): AuthUser | undefined => {
    const userString = localStorage.getItem('user');
    if (!userString) return;

    return JSON.parse(userString);
  };

  React.useEffect(() => {
    const parsedUser = getCurrentUser();

    if (parsedUser) {
      setUser(parsedUser);
    }

    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, getCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
