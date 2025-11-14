import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { TestGreenbacksProvider } from 'context/Greenbacks';
import { transactions } from 'stories/testTransactions';
import buildApiTransactionsMock from '__test__/utils/buildApiTransactionsMock';
import datetime from 'utils/datetime';
import {
  CumulativeAmountSummary,
  CumulativeAmountSummaryContainer,
} from './CumulativeAmountSummary';

type Args = React.ComponentProps<typeof CumulativeAmountSummary> & {
  endDate: string;
  expandedTag?: string;
  month: string;
  startDate: string;
};

const meta: Meta<Args> = {
  args: {
    areAllTagsVisible: false,
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
    expandedTag: undefined,
    hasMonthSelector: false,
    isCurrentMonth: false,
    isLoading: false,
    month: undefined,
    onChangeMonth: fn(),
    onSelectTag: fn(),
    startDate: undefined,
    transactions,
    visibleTagCount: 5,
  },
  argTypes: {
    endDate: {
      control: 'text',
    },
    month: {
      control: 'text',
    },
    startDate: {
      control: 'text',
    },
  },
  component: CumulativeAmountSummary,
  parameters: {
    layout: 'centered',
  },
  render: (args) => <StoryWrapper {...args} />,
  title: 'Molecules/CumulativeAmountSummary',
};

function StoryWrapper(props: Args): React.ReactElement {
  const { expandedTag: initialExpandedTag } = props;
  const [expandedTag, setExpandedTag] = useState<string | undefined>(
    initialExpandedTag,
  );
  const [visibleTagCount, setVisibleTagCount] = useState<number>(5);
  const { endDate, month, startDate } = props;
  const parsedEndDate: datetime | undefined =
    endDate && datetime.fromISO(endDate);
  const parsedStartDate: datetime | undefined =
    startDate && datetime.fromISO(startDate);
  const parsedMonth: datetime | undefined = month && datetime.fromISO(month);
  return (
    <CumulativeAmountSummary
      {...props}
      endDate={parsedEndDate}
      expandedTag={expandedTag}
      month={parsedMonth}
      onChangeVisibleTagCount={setVisibleTagCount}
      onSelectTag={(tag) => setExpandedTag(tag)}
      startDate={parsedStartDate}
      visibleTagCount={visibleTagCount}
    />
  );
}

type Story = StoryObj<typeof CumulativeAmountSummary>;

export const ThisMonth: Story = {
  args: {
    isCurrentMonth: true,
  },
};

export const Loading: Story = {
  args: {
    isCurrentMonth: true,
    isLoading: true,
  },
};

export const SpecificMonth: Story = {
  args: {
    month: datetime.fromISO('2024-01'),
  },
};

export const DateRange: Story = {
  args: {
    endDate: datetime.fromISO('2024-01-10'),
    startDate: datetime.fromISO('2024-01-01'),
  },
};

export const StartDate: Story = {
  args: {
    startDate: datetime.fromISO('2024-01-01'),
  },
};

export const AllTagsVisible: Story = {
  args: {
    areAllTagsVisible: true,
    isCurrentMonth: true,
  },
};

export const Expanded: Story = {
  args: {
    expandedTag: 'Untagged',
    isCurrentMonth: true,
  },
};

export const NoTransactions: Story = {
  args: {
    isCurrentMonth: true,
    transactions: undefined,
  },
};

export const WithMonthSelector: Story = {
  args: {
    hasMonthSelector: true,
    month: datetime.fromISO('2024-05'),
    transactions: undefined,
  },
};

export const InContainer: Story = {
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
      <CumulativeAmountSummaryContainer />
    </TestGreenbacksProvider>
  ),
};

export default meta;
