import React, { ReactElement, ReactNode } from 'react';
import styled from 'styled-components';
import LoadingIndicator from './LoadingIndicator';
import { Size, Text } from './Text';

export function Placeholder({
  children,
  height = '300px',
  loading = false,
}: {
  children?: ReactNode;
  height?: string;
  loading?: boolean;
}): ReactElement {
  return (
    <Wrapper $height={height}>
      {loading ? (
        <LoadingIndicator />
      ) : (
        <Text size={Size.Small}>{children}</Text>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div<{ $height: string }>`
  align-items: center;
  background-color: #f7f7f7;
  display: flex;
  height: ${({ $height }) => $height};
  justify-content: center;
  min-width: 100px;
  width: 100%;
`;
