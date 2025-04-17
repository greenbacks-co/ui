import React, { FC } from 'react';

import noop from 'utils/noop';
import styled from 'utils/styled';

const Checkbox: FC<{
  colour?: string;
  isChecked?: boolean;
  label?: string;
  name?: string;
  onChange?: (isChecked: boolean) => void;
  value?: string;
}> = ({
  colour,
  isChecked = false,
  label = '',
  onChange = noop,
  name = '',
  value = '',
}) => (
  <>
    <input
      checked={isChecked}
      data-checked={isChecked}
      id={value}
      name={name}
      onChange={() => {
        onChange(!isChecked);
      }}
      type="checkbox"
      value={value}
    />
    <label htmlFor={value}>{label}</label>
    {colour && <Badge $colour={colour} />}
  </>
);

const Badge = styled.div<{ $colour: string }>`
  background-color: ${(props) => props.$colour};
  border-radius: 50%;
  display: inline-block;
  height: 12px;
  margin-left: 4px;
  width: 12px;
`;

export default Checkbox;
