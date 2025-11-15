import React, { createContext, FC, useState } from 'react';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';

import noop from 'utils/noop';
import { Login } from '../components/pages/Login';

interface AuthContext {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContext>({
  isAuthenticated: false,
  login: noop,
  logout: noop,
});

const AuthProvider: FC = ({ children }) => (
  <Auth0Provider
    audience="https://greenbacks"
    clientId="KO3di6CbUea9Cy6kafI5prCOsNPdZuEk"
    domain="dev-ql06dx5h.us.auth0.com"
    redirectUri={window.location.origin}
  >
    <InnerProvider>{children}</InnerProvider>
  </Auth0Provider>
);

const InnerProvider: FC = ({ children }) => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  if (!isAuthenticated) return <Login onLogin={loginWithRedirect} />;
  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login: loginWithRedirect, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const TestAuthProvider: FC<TestProps> = ({
  children,
  isAuthenticated: isInitiallyAuthenticated = true,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    isInitiallyAuthenticated,
  );
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login: () => {
          setIsAuthenticated(true);
        },
        logout: () => {
          setIsAuthenticated(false);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

interface TestProps {
  isAuthenticated?: boolean;
}

export default AuthProvider;
