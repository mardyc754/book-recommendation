import * as React from 'react';
import { AuthUser } from 'types';
import { getCurrentUser } from 'features/BackendAPI';

type AuthContextValues = {
  user: AuthUser | undefined;
  isLoading: boolean;
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

  React.useEffect(() => {
    const parsedUser = getCurrentUser();

    if (parsedUser) {
      setUser(parsedUser);
    }

    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
