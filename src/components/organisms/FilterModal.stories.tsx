import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { v4 as generateUuid } from 'uuid';

import { TestFiltersProvider } from 'context/Filters';
import type { Filter } from 'types/filter';
import GreenbacksTransaction, {
  Category,
  TransactionType,
} from 'types/transaction';
import { Variability } from 'types/variability';
import { NewFilterModal, NewFilterModalContainer } from './FilterModal';

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

const meta: Meta<typeof NewFilterModal> = {
  args: {
    onClose: fn(),
    transaction,
  },
  component: NewFilterModal,
  parameters: {
    layout: 'fullscreen',
  },
  title: 'Molecules/NewFilterModal',
};

type Story = StoryObj<typeof NewFilterModal>;

export const Default: Story = {};

export const InContainer: Story = {
  render: (args) => (
    <TestFiltersProvider
      filters={[
        buildFilter('Rent'),
        buildFilter('Groceries', { variability: Variability.Fixed }),
        buildFilter('Groceries', { variability: Variability.Fixed }),
        buildFilter('Groceries', { variability: Variability.Fixed }),
        buildFilter('Groceries', { variability: Variability.Fixed }),
        buildFilter('Groceries', { variability: Variability.Fixed }),
        buildFilter('Entertainment'),
        buildFilter('Entertainment'),
        buildFilter('Entertainment'),
        buildFilter('Entertainment'),
        buildFilter('Entertainment'),
        buildFilter('Entertainment'),
        buildFilter('Entertainment'),
        buildFilter('Retirement', { category: Category.Saving }),
        buildFilter('Retirement', { category: Category.Saving }),
        buildFilter('Retirement', { category: Category.Saving }),
        buildFilter('Retirement', { category: Category.Saving }),
        buildFilter('Restaurants'),
        buildFilter('Restaurants'),
        buildFilter('Restaurants'),
        buildFilter('Internet'),
        buildFilter('Phone'),
      ]}
    >
      <NewFilterModalContainer {...args} />
    </TestFiltersProvider>
  ),
};

function buildFilter(
  tag: string,
  {
    category = Category.Spending,
    variability = Variability.Variable,
  }: { category?: Category; variability?: Variability } = {},
): Filter {
  return {
    categoryToAssign: category,
    id: generateUuid(),
    matchers: [],
    tagToAssign: tag,
    variabilityToAssign: variability,
  };
}

export default meta;
