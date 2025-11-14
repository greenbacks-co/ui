import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import Option from 'types/option';
import Typeahead from './Typeahead';

const meta: Meta<typeof Typeahead> = {
  args: {
    id: 'typeahead',
    onChange: fn(),
    options: [
      'apple',
      'banana',
      'grape',
      'grapefruit',
      'orange',
      'peach',
      'pear',
      'pineapple',
    ],
  },
  component: Typeahead,
  title: 'Atoms/Typeahead',
};

type Story = StoryObj<typeof Typeahead>;

export const Default: Story = {};

export const InContainer: Story = {
  render: ({ options }) => <TypeaheadContainer options={options} />,
};

function TypeaheadContainer({
  options = [],
}: {
  options?: (Option | string)[];
}): React.ReactElement {
  const [value, setValue] = useState<string | undefined>();
  return (
    <Typeahead
      id="typeahead"
      onChange={setValue}
      options={options}
      value={value}
    />
  );
}

export default meta;
