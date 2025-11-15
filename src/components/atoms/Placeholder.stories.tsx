import type { Meta, StoryObj } from '@storybook/react';

import { Placeholder as Component } from './Placeholder';

const meta: Meta<React.ComponentProps<typeof Component>> = {
  args: {
    children: 'Placeholder',
    height: '300px',
  },
  component: Component,
  parameters: {
    layout: 'centered',
  },
};

type Story = StoryObj<typeof Component>;

export const Playground: Story = {};

export default meta;
