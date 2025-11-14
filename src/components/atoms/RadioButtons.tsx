import React, { FC } from 'react';

import noop from 'utils/noop';
import styled from 'utils/styled';
import { Icon, IconType } from './Icon';
import { basicFontStyles } from './Text';

const RadioButtons: FC<{
  customIcon?: IconType;
  hasSharpUpperCorners?: boolean;
  hasTopBorder?: boolean;
  hasVisibleButtons?: boolean;
  label?: string;
  name?: string;
  onChange?: (input: string) => void;
  options?: (Option | string)[];
  value?: string;
}> = ({
  customIcon,
  hasSharpUpperCorners = false,
  hasTopBorder = true,
  hasVisibleButtons = true,
  label,
  name = 'radio-button',
  onChange = noop,
  options = [],
  value,
}) => (
  <FieldSet
    $hasSharpUpperCorners={hasSharpUpperCorners}
    $hasTopBorder={hasTopBorder}
  >
    {label && <legend>{label}</legend>}
    {options.map((option) => {
      const { label: optionLabel, value: optionValue } = getOption(option);
      return (
        <InputOption
          key={optionValue}
          hasCustomIcon={customIcon !== undefined}
          hasVisibleButtons={hasVisibleButtons}
        >
          <input
            checked={optionValue === value}
            id={optionValue}
            name={name}
            onChange={() => {
              onChange(optionValue);
            }}
            type="radio"
            value={optionValue}
          />
          {customIcon && <Icon icon={customIcon} />}
          <label htmlFor={optionValue}>{optionLabel}</label>
        </InputOption>
      );
    })}
  </FieldSet>
);

interface Option {
  label: string;
  value: string;
}

const getOption = (option: Option | string): Option => {
  if (typeof option === 'string') return { label: option, value: option };
  return option;
};

const FieldSet = styled.fieldset<{
  $hasSharpUpperCorners?: boolean;
  $hasTopBorder?: boolean;
}>`
  border: solid lightgrey 1px;
  border-radius: 4px;
  margin: 0;
  padding: 0;

  & > div:last-child {
    border-bottom: none;
  }

  ${({ $hasSharpUpperCorners = false }) =>
    $hasSharpUpperCorners &&
    `
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    `}

  ${({ $hasTopBorder = true }) => !$hasTopBorder && `border-top: none;`}
`;

const InputOption = styled.div<{
  hasCustomIcon?: boolean;
  hasVisibleButtons?: boolean;
}>`
  align-items: center;
  border-bottom: solid lightgrey 1px;
  display: grid;
  grid-template-columns: max-content ${({ hasCustomIcon = false }) =>
      hasCustomIcon && 'max-content'} 1fr;
  padding: 8px 16px;

  ${basicFontStyles}

  div:has(svg) {
    margin-right: 8px;
  }

  input {
    margin: 0;
    ${({ hasCustomIcon = false, hasVisibleButtons = true }) =>
      hasVisibleButtons && !hasCustomIcon && `margin-right: 8px;`}
    ${({ hasCustomIcon = false, hasVisibleButtons = true }) =>
      (!hasVisibleButtons || hasCustomIcon) &&
      `
        margin-left: -4px;
        opacity: 0;
        width: 0;
    `}
  }
`;

export default RadioButtons;
