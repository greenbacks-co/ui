import React from 'react';
import { usePlaidLink } from 'react-plaid-link';

import PageWrapper from 'components/PageWrapper';
import useAccounts, { Account } from 'hooks/useAccounts';
import { useInitializationToken } from 'hooks/useInitializationToken';
import useUpdateAccountConnection from 'hooks/useUpdateAccountConnection';
import LoadingIndicator from '../atoms/LoadingIndicator';
import Button from '../atoms/Button';
import noop from '../../utils/noop';

export function Accounts({
  accounts = [],
  isLoadingAccounts = false,
  onClickConnect = noop,
  onClickReauthenticate = noop,
}: {
  accounts?: Account[];
  isLoadingAccounts?: boolean;
  onClickConnect?: () => void;
  onClickReauthenticate?: (input: string) => void;
}): React.ReactElement {
  if (isLoadingAccounts)
    return (
      <PageWrapper name="accounts">
        <LoadingIndicator name="accounts" />
      </PageWrapper>
    );

  return (
    <PageWrapper name="accounts">
      {accounts.length > 0 ? (
        <ul>
          {accounts.map(
            ({ id, institution: { name }, isReauthenticationRequired }) => (
              <li data-testid={`account-wrapper-${id}`} key={id}>
                {name}
                {isReauthenticationRequired && (
                  <Button onClick={() => onClickReauthenticate(id)}>
                    Reauthenticate
                  </Button>
                )}
              </li>
            ),
          )}
        </ul>
      ) : (
        <div>You haven&apos;t connected any accounts yet</div>
      )}
      <Button
        onClick={() => {
          onClickConnect();
        }}
      >
        Connect Account
      </Button>
    </PageWrapper>
  );
}

export function AccountsContainer(): React.ReactElement {
  const { accounts, isLoading: isLoadingAccounts, saveAccount } = useAccounts();
  const { update } = useUpdateAccountConnection();
  const { fetchInitializationToken, token: initializationToken } =
    useInitializationToken();
  const { isReady, open } = useAccountConnector({
    initializationToken,
    onSuccess: (token) => {
      saveAccount({ token });
    },
  });
  const [hasOpened, setHasOpened] = React.useState<boolean>(false);
  React.useEffect(() => {
    if (isReady && !hasOpened) {
      open();
      setHasOpened(true);
    }
  }, [hasOpened, isReady, open, setHasOpened]);
  return (
    <Accounts
      accounts={accounts}
      isLoadingAccounts={isLoadingAccounts}
      onClickReauthenticate={(accountId) => update?.({ accountId })}
      onClickConnect={fetchInitializationToken}
    />
  );
}

function useAccountConnector({
  initializationToken,
  onExit = noop,
  onSuccess = noop,
}: {
  initializationToken?: string;
  onExit?: () => void;
  onSuccess?: (input: string) => void;
}): { isReady: boolean; open: () => void } {
  const { open, ready } = usePlaidLink({
    onExit,
    onSuccess,
    token: initializationToken ?? null,
  });
  const isReady = initializationToken !== undefined && ready;
  return {
    isReady,
    open: () => {
      if (!isReady) return;
      open();
    },
  };
}

export default Accounts;
