import React, { FC } from 'react';

import styled from 'utils/styled';
import LoadingIndicator from './atoms/LoadingIndicator';

const Badge: FC<Props> = ({ children, isLoading = false, label, name }) => {
  if (isLoading) return <LoadingIndicator name={name} />;

  return (
    <Wrapper>
      <Text data-testid={name}>{children}</Text>
      {label && <Label data-testid={`${name}-label`}>{label}</Label>}
    </Wrapper>
  );
};

export interface Props {
  isLoading?: boolean;
  label?: string;
  name?: string;
}

const Wrapper = styled.article`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Text = styled.p`
  font-size: 1.4rem;
  margin: 0;
  margin-bottom: 10px;
`;

const Label = styled.p`
  font-size: 0.8rem;
  margin: 0;
`;

export default Badge;
