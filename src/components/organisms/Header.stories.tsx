import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { TestGreenbacksProvider } from 'context/Greenbacks';
import { Header } from './Header';

const meta: Meta<typeof Header> = {
  args: {
    onLogout: fn(),
  },
  component: Header,
  parameters: { layout: 'fullscreen' },
  render: (args) => (
    <TestGreenbacksProvider>
      <Header {...args} />
    </TestGreenbacksProvider>
  ),
  title: 'Molecules/Header',
};

type Story = StoryObj<typeof Header>;

export const Default: Story = {};

export default meta;
