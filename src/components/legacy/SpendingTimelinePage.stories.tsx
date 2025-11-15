import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { TestGreenbacksProvider } from 'context/Greenbacks';
import { transactions } from 'stories/testTransactions';
import buildApiTransactionsMock from '__test__/utils/buildApiTransactionsMock';
import SpendingTimeline from './SpendingTimeline';

const meta: Meta<typeof SpendingTimeline> = {
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
          startDate: '2024-02-01',
          transactions: [
            ...transactions,
            ...transactions,
            ...transactions,
            ...transactions,
          ],
        }),
        buildApiTransactionsMock({
          endDate: '2024-04-30',
          startDate: '2023-11-01',
          transactions: [
            ...transactions,
            ...transactions,
            ...transactions,
            ...transactions,
            ...transactions,
            ...transactions,
            ...transactions,
          ],
        }),
        buildApiTransactionsMock({
          endDate: '2024-04-30',
          startDate: '2023-05-01',
          transactions: [
            ...transactions,
            ...transactions,
            ...transactions,
            ...transactions,
            ...transactions,
            ...transactions,
            ...transactions,
            ...transactions,
            ...transactions,
            ...transactions,
            ...transactions,
            ...transactions,
            ...transactions,
          ],
        }),
      ]}
      now="2024-05-06"
    >
      <SpendingTimeline />
    </TestGreenbacksProvider>
  ),
  title: 'Pages/SpendingTimeline',
};

type Story = StoryObj<typeof SpendingTimeline>;

export const Default: Story = {};

export default meta;
