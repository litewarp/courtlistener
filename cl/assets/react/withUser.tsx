import React from 'react';
import { getUserStateFromDom } from './_domUtils';

interface UserState {
  userId?: number;
  userName?: string;
  editUrl?: string;
  isPageOwner: boolean;
}

interface AuthContextState extends UserState {
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = React.createContext<AuthContextState>({
  loading: true,
  isAuthenticated: false,
});

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [user, setUser] = React.useState<UserState | null>(null);

  React.useEffect(() => {
    const activeUser = getUserStateFromDom();
    if (activeUser) {
      setUser(activeUser);
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...user,
        loading: loading,
        isAuthenticated: !!user?.userId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useUser = () => React.useContext(AuthContext);

export default AuthContextProvider;
