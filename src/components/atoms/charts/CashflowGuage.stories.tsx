import type { Meta, StoryObj } from '@storybook/react';

import { CashflowGuage as Component } from './CashflowGuage';

const meta: Meta<React.ComponentProps<typeof Component>> = {
  args: {
    fixedEarning: 100000,
    fixedSaving: 60000,
    fixedSpending: 60000,
    projectedFixedEarning: 120000,
    projectedFixedSpending: 70000,
    variableEarning: 100000,
    variableSaving: 60000,
    variableSpending: 60000,
  },
  component: Component,
  parameters: {
    layout: 'centered',
  },
};

type Story = StoryObj<typeof Component>;

export const Playground: Story = {};

export default meta;
