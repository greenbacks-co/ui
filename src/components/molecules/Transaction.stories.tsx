import type { Meta, StoryObj } from '@storybook/react';

import GreenbacksTransaction, {
  Category,
  TransactionType,
} from 'types/transaction';
import Transaction from './Transaction';

const transaction: GreenbacksTransaction = {
  accountId: 'account-1',
  amount: 3599,
  category: Category.Spending,
  datetime: '2020-01-01',
  id: 'transaction-1',
  merchant: 'Merchant 1',
  name: 'Transaction 1',
  type: TransactionType.Debit,
};

const meta: Meta<typeof Transaction> = {
  args: {
    isDateVisible: undefined,
    isFilteringEnabled: undefined,
    transaction,
  },
  component: Transaction,
  parameters: {
    layout: 'centered',
  },
  title: 'Molecules/Transaction',
};

type Story = StoryObj<typeof Transaction>;

export const Default: Story = {
  args: {},
};

export const Filterable: Story = {
  args: {
    isFilteringEnabled: true,
  },
};

export const Compact: Story = {
  args: {
    isCompact: true,
  },
};

export default meta;
