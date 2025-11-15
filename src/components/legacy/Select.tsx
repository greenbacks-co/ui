import React, { FC } from 'react';

import noop from 'utils/noop';

const Select: FC<{
  id: string;
  onChange?: (input: string) => void;
  options: Option[];
  value: string;
}> = ({ id, onChange = noop, options, value }) => (
  <select
    id={id}
    onChange={(event) => {
      onChange(event.target.value);
    }}
    value={value}
  >
    <option value="">Please select</option>
    {options.map((option) => {
      const { key, label, value: optionValue } = formatOption({ option });
      return (
        <option key={key} value={optionValue}>
          {label}
        </option>
      );
    })}
  </select>
);

type Option = string | { label: string; value: string };

const formatOption = ({
  option,
}: {
  option: Option;
}): { key: string; label: string; value: string } => {
  if (typeof option === 'string')
    return {
      key: option as string,
      label: option as string,
      value: option as string,
    };
  const { label, value } = option as { label: string; value: string };
  return {
    key: value,
    label,
    value,
  };
};

export default Select;
