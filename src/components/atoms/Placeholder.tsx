import React, { ReactElement, ReactNode } from 'react';
import styled from 'styled-components';
import { Size, Text } from './Text';

export function Placeholder({
  children,
  height = '300px',
}: {
  children?: ReactNode;
  height?: string;
}): ReactElement {
  return (
    <Wrapper $height={height}>
      <Text size={Size.Small}>{children}</Text>
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
