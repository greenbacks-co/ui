import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { Login } from 'components/LoginPage';
import { TestGreenbacksProvider } from 'context/Greenbacks';

const meta: Meta<React.ComponentProps<typeof Login>> = {
  args: {
    onLogin: fn(),
  },
  component: Login,
  parameters: {
    layout: 'fullscreen',
  },
  render: (args) => (
    <TestGreenbacksProvider>
      <Login {...args} />
    </TestGreenbacksProvider>
  ),
  title: 'Pages/Login',
};

type Story = StoryObj<typeof Login>;

export const Default: Story = {};

export default meta;
