import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import {
  TotalsByMonthGroup,
  TotalsByMonthGroupSelectionContainer,
} from 'components/TotalsByMonthGroup';
import { buildMonthTotals } from './NewTotalsByMonth.stories';

const meta: Meta<React.ComponentProps<typeof TotalsByMonthGroup>> = {
  args: {
    monthTotals: buildMonthTotals(),
  },
  component: TotalsByMonthGroup,
  parameters: {
    layout: 'centered',
  },
  title: 'Molecules/TotalsByMonthGroup',
};

type Story = StoryObj<typeof TotalsByMonthGroup>;

export const Default: Story = {};

export const InContainer: Story = {
  render: (props) => <TotalsByMonthGroupSelectionContainer {...props} />,
};

export default meta;
