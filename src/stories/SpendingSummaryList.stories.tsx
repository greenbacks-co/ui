import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { SpendingSummaryList } from 'components/SpendingSummaryList';
import { transactions } from 'stories/testTransactions';
import datetime from 'utils/datetime';

type Args = React.ComponentProps<typeof SpendingSummaryList> & {
  endDate: string;
  month: string;
  startDate: string;
};

const meta: Meta<Args> = {
  args: {
    areAllTagsVisible: false,
    endDate: undefined,
    expandedTag: undefined,
    isCurrentMonth: false,
    month: undefined,
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
  component: SpendingSummaryList,
  parameters: {
    layout: 'centered',
  },
  render: (args) => <StoryWrapper {...args} />,
  title: 'Molecules/SpendingSummaryList',
};

function StoryWrapper(props: Args): React.ReactElement {
  const [expandedTag, setExpandedTag] = useState<string | undefined>(undefined);
  const { endDate, month, startDate } = props;
  const parsedEndDate: datetime | undefined =
    endDate && datetime.fromISO(endDate);
  const parsedStartDate: datetime | undefined =
    startDate && datetime.fromISO(startDate);
  const parsedMonth: datetime | undefined = month && datetime.fromISO(month);
  return (
    <SpendingSummaryList
      {...props}
      endDate={parsedEndDate}
      expandedTag={expandedTag}
      month={parsedMonth}
      onSelectTag={(tag) => setExpandedTag(tag)}
      startDate={parsedStartDate}
    />
  );
}

type Story = StoryObj<typeof SpendingSummaryList>;

export const ThisMonth: Story = {
  args: {
    isCurrentMonth: true,
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

export default meta;
