import React, { FC, useState } from 'react';
import styled from 'styled-components';

import { IconType } from 'components/Icon';
import Input from 'components/Input';
import RadioButtons from 'components/RadioButtons';
import Option, { ComplexOption } from 'types/option';
import getOption from 'utils/getOption';
import noop from 'utils/noop';
import { Size, Text } from './atoms/Text';

const Typeahead: FC<{
  id: string;
  onChange?: (input: string) => void;
  options?: (Option | string)[];
  placeholder?: string;
  value?: string;
  visibleOptionCount?: number;
}> = ({
  id,
  onChange = noop,
  options = [],
  placeholder = 'Search',
  value,
  visibleOptionCount = 4,
}) => {
  const matchingOptions = getMatchingOptions({
    options,
    value,
  });
  const visibleOptions = matchingOptions.slice(0, visibleOptionCount);
  const [hasSelected, setHasSelected] = useState(false);
  const isExpanded = visibleOptions.length > 0 && !hasSelected;
  return (
    <>
      <Input
        hasSharpLowerCorners={isExpanded}
        id={id}
        onChange={(newValue) => {
          setHasSelected(false);
          onChange(newValue);
        }}
        placeholder={placeholder}
        value={value}
      />
      {isExpanded && (
        <RadioButtons
          customIcon={IconType.ArrowRight}
          hasSharpUpperCorners
          hasTopBorder={false}
          onChange={(newValue) => {
            setHasSelected(true);
            onChange(newValue);
          }}
          options={visibleOptions}
        />
      )}
      {matchingOptions.length > visibleOptions.length && (
        <TextWrapper>
          <Text size={Size.Small}>
            {matchingOptions.length - visibleOptions.length} more matching
            options
          </Text>
        </TextWrapper>
      )}
    </>
  );
};

function getMatchingOptions({
  options,
  value,
}: {
  options?: Option[];
  value?: string;
}): ComplexOption[] {
  if (!options) return [];
  const complexOptions = options.map(getOption);
  if (!value) return complexOptions;
  return complexOptions.filter((option) => {
    const lowercaseOption = option.value.toLowerCase();
    const lowercaseValue = value.toLowerCase();
    const containsValue = lowercaseOption.includes(lowercaseValue);
    const isValue = lowercaseOption === lowercaseValue;
    return containsValue && !isValue;
  });
}

const TextWrapper = styled.div`
  padding 8px 16px;
`;

export default Typeahead;
