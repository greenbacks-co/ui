import React from 'react';
import styled from 'styled-components';

import Button from 'components/Button';
import { Link } from 'components/Link';
import { PageWrapper } from 'components/Page';
import { Size, Text } from 'components/Text';
import useLogin from 'hooks/useLogin';
import noop from 'utils/noop';

export function Login({
  onLogin = noop,
}: {
  onLogin?: () => void;
}): React.ReactElement {
  return (
    <PageWrapper isVerticallyCentered>
      <Wrapper>
        <Text size={Size.Large}>Greenbacks</Text>
        <Text size={Size.Small}>Understand your finances</Text>
        <Button isFullWidth onClick={onLogin}>
          Login
        </Button>
        <LinkWrapper>
          <Link href="/demo">Demo</Link>
        </LinkWrapper>
      </Wrapper>
    </PageWrapper>
  );
}

const Wrapper = styled.div`
  padding-bottom: 128px;

  & > p:nth-child(2) {
    margin-bottom: 128px;
    text-align: center;
  }
`;

const LinkWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

export function LoginContainer(): React.ReactElement {
  const { login } = useLogin();
  return <Login onLogin={login} />;
}
