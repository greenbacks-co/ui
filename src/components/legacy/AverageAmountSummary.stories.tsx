import type { Meta, StoryObj } from '@storybook/react';

import { transactionsYearBeforeMay2024 } from 'stories/testTransactions';
import { AverageAmountSummary } from './AverageAmountSummary';

const meta: Meta<React.ComponentProps<typeof AverageAmountSummary>> = {
  args: {
    expandedTag: undefined,
    isLoading: false,
    transactions: transactionsYearBeforeMay2024,
    visibleTagCount: 5,
  },
  component: AverageAmountSummary,
  parameters: {
    layout: 'centered',
  },
  title: 'Molecules/AverageAmountSummary',
};

type Story = StoryObj<typeof AverageAmountSummary>;

export const Default: Story = {
  args: {
    expandedTag: 'Groceries',
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export default meta;
