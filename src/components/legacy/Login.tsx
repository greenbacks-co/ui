import React, { FunctionComponent, useEffect } from 'react';

import { useAuth, useRedirectLocation } from 'auth';

export const Login: FunctionComponent = () => {
  const { loginWithRedirect } = useAuth();
  const { saveRedirectLocation } = useRedirectLocation();

  useEffect(() => {
    saveRedirectLocation(window.location.href);
  }, [saveRedirectLocation]);

  return (
    <button onClick={() => loginWithRedirect()} type="button">
      Login
    </button>
  );
};

export default Login;
