import React, { ReactElement, ReactNode, useState } from 'react';

import noop from 'utils/noop';
import styled, { css } from 'utils/styled';

import { Button, ButtonStyle } from './Button';

export const List = styled.ul<{
  hasOutsideBorder?: boolean;
  hasRoundedBottomCorners?: boolean;
  hasRoundedTopCorners?: boolean;
  isIndented?: boolean;
  isInset?: boolean;
}>`
  border-radius: 4px;
  list-style-type: none;
  margin: 0;
  padding: 0;

  ${({ isInset = false }) =>
    isInset &&
    `
      background-color: #f9f9f9;
      box-shadow: grey 0px 3px 4px -4px inset;
  `}

  ${({ hasOutsideBorder = true }) =>
    hasOutsideBorder && 'border: solid lightgrey 1px;'}

  ${({ hasRoundedTopCorners = true }) =>
    !hasRoundedTopCorners &&
    `
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  `}

  ${({ hasRoundedBottomCorners = true }) =>
    !hasRoundedBottomCorners &&
    `
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  `}

  & > li {
    border-top: solid lightgrey 1px;
    ${({ isIndented }) => isIndented && 'padding-left: 24px;'}
  }

  & > li:first-child {
    border-top: none;
  }
`;

const ItemStyle = css<{
  hasPadding?: boolean;
  isInset?: boolean;
  isJustifiedRow?: boolean;
}>`
  padding: ${({ hasPadding = true }) => (hasPadding ? '8px 16px' : '0')};

  ${({ isInset = false }) =>
    isInset &&
    `
      background-color: #f9f9f9;
  `}

  ${({ isJustifiedRow = false }) =>
    isJustifiedRow && 'display: flex; justify-content: space-between;'}
`;

export const Item = styled.li<{
  hasPadding?: boolean;
  isInset?: boolean;
  isJustifiedRow?: boolean;
}>`
  ${ItemStyle}
`;

const ExpanderHeadingWrapper = styled.div`
  ${ItemStyle}
`;

export function Expander({
  body,
  heading,
  isExpanded = false,
  onCollapse = noop,
  onExpand = noop,
}: {
  body?: ReactNode;
  heading?: ReactNode;
  isExpanded?: boolean;
  onCollapse?: () => void;
  onExpand?: () => void;
}): ReactElement {
  const onClick = isExpanded ? onCollapse : onExpand;
  return (
    <Item hasPadding={false}>
      <Button isFullWidth onClick={onClick} style={ButtonStyle.Unstyled}>
        <ExpanderHeadingWrapper>{heading}</ExpanderHeadingWrapper>
      </Button>
      {isExpanded && body}
    </Item>
  );
}

export function ExpanderContainer(props: {
  body?: ReactNode;
  heading?: ReactNode;
}): ReactElement {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <Expander
      isExpanded={isExpanded}
      onCollapse={() => setIsExpanded(false)}
      onExpand={() => setIsExpanded(true)}
      {...props}
    />
  );
}

export default List;
