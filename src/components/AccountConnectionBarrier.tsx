import React, { FC } from 'react';

import useReauthenticationRequired from 'hooks/useReauthenticationRequired';
import Link from './atoms/Link';

const AccountConnectionBarrier: FC = ({ children }) => {
  const { isReauthenticationRequired } = useReauthenticationRequired();

  if (isReauthenticationRequired)
    return (
      <>
        <p>At least one of your accounts needs reauthentication</p>
        <Link href="accounts">Accounts</Link>
      </>
    );

  return <>{children}</>;
};

export default AccountConnectionBarrier;
