import React, { FC } from 'react';
import styled from 'styled-components';

import { ReactComponent as UnstyledCog } from 'assets/icons/cog.svg';

const LoadingIndicator: FC<Props> = ({ name } = {}) => {
  const testId = name ? `loading-indicator-${name}` : 'loading-indicator';
  return (
    <div aria-label="loading" role="status" data-testid={testId}>
      <Cog />
    </div>
  );
};

interface Props {
  name?: string;
}

const Cog = styled(UnstyledCog)`
  animation: spin 2s linear infinite;
  fill: #013220;
  width: 20px;

  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default LoadingIndicator;
