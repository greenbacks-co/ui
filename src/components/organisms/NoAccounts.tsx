import React, { useContext } from 'react';
import styled from 'styled-components';

import Link from 'components/Link';
import { UserSettingsContext } from 'context/UserSettings';
import useAccounts, { Account } from 'hooks/useAccounts';
import noop from 'utils/noop';
import { PageContainer } from '../molecules/Page';
import { Text } from '../atoms/Text';
import { Button, ButtonStyle } from '../atoms/Button';

export function NoAccounts({
  onEnableDemoMode = noop,
}: {
  onEnableDemoMode?: () => void;
}): React.ReactElement {
  return (
    <PageContainer>
      <Wrapper>
        <Text>You have not yet connected any accounts to Greenbacks</Text>
        <Text>
          Please <Link href="/accounts">connect an account</Link> or{' '}
          <Button onClick={onEnableDemoMode} style={ButtonStyle.Text}>
            enable demo mode
          </Button>
          .
        </Text>
      </Wrapper>
    </PageContainer>
  );
}

const Wrapper = styled.div`
  p:first-child {
    margin-bottom: 32px;
  }
`;

export function NoAccountsContainer(): React.ReactElement {
  const { onChangeTestDataUsage } = useContext(UserSettingsContext);
  return <NoAccounts onEnableDemoMode={() => onChangeTestDataUsage(true)} />;
}

export function NoAccountsBarrier({
  accounts = [],
  children = <></>,
  isDemoMode = false,
  isLoadingAccounts = false,
  onEnableDemoMode = noop,
}: {
  accounts?: Account[];
  children?: React.ReactNode;
  isDemoMode?: boolean;
  isLoadingAccounts?: boolean;
  onEnableDemoMode?: () => void;
}): React.ReactElement {
  if (isDemoMode) return <>{children}</>;
  if (isLoadingAccounts) return <>{children}</>;
  if (accounts.length > 0) return <>{children}</>;
  return <NoAccounts onEnableDemoMode={onEnableDemoMode} />;
}

export function NoAccountsBarrierContainer({
  children = <></>,
}: {
  children?: React.ReactNode;
}): React.ReactElement {
  const { accounts, isLoadingAccounts } = useAccounts();
  const { isTestData, onChangeTestDataUsage } = useContext(UserSettingsContext);
  return (
    <NoAccountsBarrier
      accounts={accounts}
      isDemoMode={isTestData}
      isLoadingAccounts={isLoadingAccounts}
      onEnableDemoMode={() => onChangeTestDataUsage(true)}
    >
      {children}
    </NoAccountsBarrier>
  );
}
