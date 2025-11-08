import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { Category } from 'types/transaction';
import { Variability } from 'types/variability';
import { CategoryBreakdownPanel as Component } from './CategoryBreakdownPanel';

const meta: Meta<React.ComponentProps<typeof Component>> = {
  args: {
    category: Category.Saving,
    onSelect: fn(),
    tags: [
      {
        name: 'First',
        total: 200000,
      },
      {
        name: 'Second',
        total: 150000,
      },
      {
        name: 'Third',
        total: 100000,
      },
    ],
    variability: Variability.Fixed,
  },
  component: Component,
  parameters: {
    layout: 'centered',
  },
};

type Story = StoryObj<typeof Component>;

export const Playground: Story = {};

export default meta;
