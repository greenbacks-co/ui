import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { TestGreenbacksProvider } from 'context/Greenbacks';
import {
  transactions,
  transactionsYearBeforeMay2024,
} from 'stories/testTransactions';
import buildApiTransactionsMock from '__test__/utils/buildApiTransactionsMock';
import { SpendingSummary } from './SpendingSummary';

const meta: Meta<React.ComponentProps<typeof SpendingSummary>> = {
  args: {
    transactions: transactionsYearBeforeMay2024,
  },
  component: SpendingSummary,
  parameters: {
    layout: 'centered',
  },
  render: () => (
    <TestGreenbacksProvider
      mocks={[
        buildApiTransactionsMock({
          endDate: '2024-05-31',
          startDate: '2024-05-01',
          transactions,
        }),
        buildApiTransactionsMock({
          endDate: '2024-04-30',
          startDate: '2023-05-01',
          transactions: transactionsYearBeforeMay2024,
        }),
      ]}
      now="2024-05-06"
    >
      <SpendingSummary />
    </TestGreenbacksProvider>
  ),
  title: 'Pages/SpendingSummary',
};

type Story = StoryObj<typeof SpendingSummary>;

export const Default: Story = {};

export default meta;
