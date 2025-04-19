import { DateTime } from 'luxon';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { MonthSelector, MonthSelectorPanel } from 'components/MonthSelector';

const meta: Meta<typeof MonthSelector> = {
  args: {
    onClickNext: fn(),
    onClickPrevious: fn(),
    month: DateTime.now(),
  },
  component: MonthSelector,
  parameters: {
    layout: 'centered',
  },
  title: 'Molecules/MonthSelector',
};

type Story = StoryObj<typeof MonthSelector>;

export const Default: Story = {};

export const Panel: Story = {
  render: (props) => <MonthSelectorPanel {...props} />,
};

export default meta;
