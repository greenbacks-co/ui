import type { Meta, StoryObj } from '@storybook/react';
import { transactions } from 'stories/testTransactions';

import { TransactionsPanel as Component } from './TransactionsPanel';

const meta: Meta<React.ComponentProps<typeof Component>> = {
  args: {
    transactions,
  },
  component: Component,
  parameters: {
    layout: 'centered',
  },
};

type Story = StoryObj<typeof Component>;

export const Playground: Story = {};

export const Placeholder: Story = {
  args: {
    transactions: undefined,
  },
};

export default meta;
