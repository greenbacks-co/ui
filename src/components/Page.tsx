import React, { useContext } from 'react';
import styled from 'styled-components';

import { Header } from 'components/Header';
import { UserSettingsContext } from 'context/UserSettings';
import useLogout from 'hooks/useLogout';
import noop from 'utils/noop';

export function Page({
  children,
  hasLinks = true,
  hasWidgetLink = false,
  onLogout = noop,
}: {
  children?: React.ReactNode;
  hasLinks?: boolean;
  hasWidgetLink?: boolean;
  onLogout?: () => void;
}): React.ReactElement {
  return (
    <PageWrapper>
      <Header
        hasLinks={hasLinks}
        hasWidgetLink={hasWidgetLink}
        onLogout={onLogout}
      />
      <PageBody>{children}</PageBody>
    </PageWrapper>
  );
}

export const PageWrapper = styled.main<{ isVerticallyCentered?: boolean }>`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100vh;
  ${({ isVerticallyCentered = false }) =>
    isVerticallyCentered && 'justify-content: center;'}
  width: 100vw;
`;

export const PageBody = styled.article`
  box-sizing: border-box;
  overflow-y: scroll;
  padding: 16px;
  width: 100%;
`;

export function PageContainer({
  children,
}: {
  children?: React.ReactNode;
}): React.ReactElement {
  const { logout } = useLogout();
  const { areWidgetsVisible } = useContext(UserSettingsContext);
  return (
    <Page hasWidgetLink={areWidgetsVisible} onLogout={logout}>
      {children}
    </Page>
  );
}
