import React, { FC } from 'react';

import noop from 'utils/noop';
import styled from 'utils/styled';
import { basicFontStyles } from './atoms/Text';

const Input: FC<{
  hasSharpLowerCorners?: boolean;
  id: string;
  onChange?: (input: string) => void;
  placeholder?: string;
  value?: string;
}> = ({
  hasSharpLowerCorners = false,
  id,
  onChange = noop,
  placeholder,
  value = '',
}) => (
  <StyledInput
    $hasSharpLowerCorners={hasSharpLowerCorners}
    id={id}
    onChange={(event) => {
      onChange(event.target.value);
    }}
    placeholder={placeholder}
    value={value}
  />
);

const StyledInput = styled.input<{ $hasSharpLowerCorners?: boolean }>`
  border: solid lightgrey 1px;
  border-radius: 4px;
  box-sizing: border-box;
  outline: none;
  padding: 8px 16px;
  width: 100%;

  ${({ $hasSharpLowerCorners }) => {
    if (!$hasSharpLowerCorners) return '';
    return `
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    `;
  }}

  ${basicFontStyles}
`;

export default Input;
