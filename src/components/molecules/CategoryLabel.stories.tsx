import type { Meta, StoryObj } from '@storybook/react';

import { CategoryLabel as Component } from './CategoryLabel';
import { Category } from '../../types/transaction';
import { Variability } from '../../types/variability';

const meta: Meta<React.ComponentProps<typeof Component>> = {
  args: {
    category: Category.Saving,
    variability: Variability.Fixed,
  },
  argTypes: {
    category: {
      control: 'select',
      options: Object.values(Category),
    },
    variability: {
      control: 'select',
      options: Object.values(Variability),
    },
  },
  component: Component,
  parameters: {
    layout: 'centered',
  },
};

type Story = StoryObj<typeof Component>;

export const Playground: Story = {};

export default meta;
