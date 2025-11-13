import React, { FunctionComponent, ReactNode } from 'react';

import { useAuth } from 'auth';
import LoadingIndicator from '../components/atoms/LoadingIndicator';

const AuthenticationBarrier: FunctionComponent<propTypes> = ({
  children,
  LoginComponent,
}: propTypes) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingIndicator />;

  if (!isAuthenticated) return <LoginComponent />;

  return <>{children}</>;
};

interface propTypes {
  children: ReactNode;
  LoginComponent: FunctionComponent;
}

export default AuthenticationBarrier;
