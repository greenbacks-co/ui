import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { TestGreenbacksProvider } from 'context/Greenbacks';
import { transactionsYearBeforeMay2024 } from 'stories/testTransactions';
import buildApiTransactionsMock from '__test__/utils/buildApiTransactionsMock';
import { AverageAmountSummaryContainer } from './AverageAmountSummary';

const meta: Meta<typeof AverageAmountSummaryContainer> = {
  parameters: {
    layout: 'centered',
  },
  render: () => (
    <TestGreenbacksProvider
      mocks={[
        buildApiTransactionsMock({
          endDate: '2024-04-30',
          startDate: '2023-05-01',
          transactions: transactionsYearBeforeMay2024,
        }),
      ]}
      now="2024-05-01"
    >
      <AverageAmountSummaryContainer />
    </TestGreenbacksProvider>
  ),
  title: 'Molecules/AverageAmountSummaryContainer',
};

type Story = StoryObj<typeof AverageAmountSummaryContainer>;

export const Default: Story = {};

export default meta;
