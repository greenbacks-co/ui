import React from 'react';
import { DateTime } from 'luxon';
import type { Meta, StoryObj } from '@storybook/react';

import { transactions } from 'stories/testTransactions';
import { PureSpendingTimeline as SpendingTimeline } from './SpendingTimeline';

type Args = React.ComponentProps<typeof SpendingTimeline> & {
  endDate: string;
  startDate: string;
};

const meta: Meta<Args> = {
  args: {
    comparisonSpendingByDate: {
      '2024-05-01': 30000,
      '2024-05-03': 30000,
      '2024-05-05': 30000,
      '2024-05-06': 30000,
      '2024-05-08': 30000,
      '2024-05-10': 30000,
      '2024-05-12': 30000,
      '2024-05-13': 30000,
      '2024-05-14': 30000,
      '2024-05-15': 30000,
      '2024-05-18': 30000,
      '2024-05-19': 30000,
      '2024-05-21': 30000,
      '2024-05-22': 30000,
      '2024-05-23': 30000,
      '2024-05-25': 30000,
      '2024-05-26': 30000,
      '2024-05-28': 30000,
      '2024-05-29': 30000,
      '2024-05-31': 30000,
    },
    endDate: undefined,
    hasXAxis: undefined,
    hasXLines: undefined,
    hasYAxis: undefined,
    startDate: undefined,
    transactions,
  },
  argTypes: {
    comparisonSpendingByDate: { control: 'object' },
  },
  component: SpendingTimeline,
  parameters: {
    layout: 'centered',
  },
  render: (args) => {
    const { endDate, startDate } = args;
    const parsedEndDate: DateTime | undefined =
      endDate && DateTime.fromISO(endDate);
    const parsedStartDate: DateTime | undefined =
      startDate && DateTime.fromISO(startDate);
    return (
      <SpendingTimeline
        {...args}
        endDate={parsedEndDate}
        startDate={parsedStartDate}
      />
    );
  },
  title: 'Molecules/SpendingTimeline',
};

type Story = StoryObj<typeof SpendingTimeline>;

export const Default: Story = {};

export const ExplicitDateRange: Story = {
  args: {
    endDate: DateTime.fromISO('2024-06-30'),
    startDate: DateTime.fromISO('2024-04-01'),
  },
};

export const CustomComparisonLabel: Story = {
  args: {
    comparisonLabel: 'average',
  },
};

export const NoPredicted: Story = {
  args: {
    hasPredicted: false,
  },
};

export default meta;
