import React from 'react';
import styled from 'styled-components';

export function Row({
  alignment = Alignment.SpaceBetween,
  children,
  columnBreakpoint,
  space = Space.None,
}: {
  alignment?: Alignment;
  children?: React.ReactNode;
  columnBreakpoint?: number;
  space?: Space;
}): React.ReactElement {
  return (
    <Wrapper
      alignment={alignment}
      columnBreakpoint={columnBreakpoint}
      space={space}
    >
      {children}
    </Wrapper>
  );
}

const Wrapper = styled.div<{
  alignment: Alignment;
  columnBreakpoint?: number;
  space: Space;
}>`
  align-items: baseline;
  display: flex;
  gap: ${({ space }) => getWidth({ space })};
  justify-content: ${({ alignment }) => alignment};
  ${({ columnBreakpoint }) =>
    columnBreakpoint &&
    `
      flex-direction: column;

      @media (min-width: ${columnBreakpoint}px) {
        flex-direction: row;
      }
    `}
`;

export enum Alignment {
  Center = 'center',
  End = 'end',
  SpaceBetween = 'space-between',
}

export enum Space {
  None = 'none',
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
}

function getWidth({ space }: { space: Space }): string {
  switch (space) {
    case Space.Small:
      return '4px';
    case Space.Medium:
      return '16px';
    case Space.Large:
      return '32px';
    case Space.None:
    default:
      return '0';
  }
}
