import type { Meta, StoryObj } from '@storybook/react';

import { transactions } from 'stories/testTransactions';
import { GroupBy, SortGroupsBy } from 'utils/groupTransactions';
import Transactions from './Transactions';

const meta: Meta<typeof Transactions> = {
  args: {
    groupBy: undefined,
    sortGroupsBy: undefined,
    transactions,
  },
  argTypes: {
    groupBy: {
      options: Object.values(GroupBy),
      control: 'radio',
    },
    sortGroupsBy: {
      options: Object.values(SortGroupsBy),
      control: 'radio',
    },
  },
  component: Transactions,
  parameters: {
    layout: 'centered',
  },
  title: 'Molecules/Transactions',
};

type Story = StoryObj<typeof Transactions>;

export const Default: Story = {
  args: {},
};

export default meta;
