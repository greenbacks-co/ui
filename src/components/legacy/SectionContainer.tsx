import React, { FC, useState } from 'react';
import styled from 'styled-components';

import noop from 'utils/noop';
import Button from '../atoms/Button';

const SectionContainer: FC<{
  area?: string;
  id: string;
  isCollapsedByDefault?: boolean;
  isCollapsible?: boolean;
  title?: string;
}> = ({
  area,
  children,
  id,
  isCollapsedByDefault = false,
  isCollapsible = false,
  title,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(
    isCollapsible && isCollapsedByDefault,
  );
  return (
    <Wrapper $area={area} data-testid={`section-${id}`}>
      {title && (
        <SectionTitle
          isCollapsible={isCollapsible}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {title}
        </SectionTitle>
      )}
      {!isCollapsed && children}
    </Wrapper>
  );
};

const SectionTitle: FC<{ isCollapsible?: boolean; onClick?: () => void }> = ({
  children,
  isCollapsible = false,
  onClick = noop,
}) => {
  if (!isCollapsible) return <h3>{children}</h3>;

  return (
    <Button onClick={onClick}>
      <h3>{children}</h3>
    </Button>
  );
};

const Wrapper = styled.section<{ $area?: string }>`
  ${({ $area }) => `grid-area: ${$area};`}
`;

export default SectionContainer;
