import React from 'react';

// import { mutations, useMutation } from 'api';
// import { useConnectionInitializer } from 'finance';
import { usePlaidLink } from 'react-plaid-link';
// import noop from 'utils/noop';

function AccountConnector({
  onSuccess,
  token,
}: {
  onSuccess: (token: string) => void;
  token?: string;
}): React.ReactElement {
  const { open, ready } = usePlaidLink({ onSuccess, token: token ?? null });
  if (token && ready) {
    open();
  }
  return <div>test</div>;
}
/*
  const [createConnection] = useMutation(mutations.createConnection, {
    onError: noop,
  });
  const { open } = useConnectionInitializer({
    onSuccess: (temporaryToken: string) =>
      createConnection({ variables: { token: temporaryToken } }),
    token,
  });

  return (
    <button onClick={() => open()} type="button">
      Connect an account
    </button>
  );
   */

export interface Props {
  onSuccess: (token: string) => void;
  token: string;
}

export default AccountConnector;
