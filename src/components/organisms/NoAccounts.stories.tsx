import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { TestGreenbacksProvider } from 'context/Greenbacks';
import { NoAccounts } from './NoAccounts';

const meta: Meta<React.ComponentProps<typeof NoAccounts>> = {
  args: {
    onEnableDemoMode: fn(),
  },
  component: NoAccounts,
  parameters: {
    layout: 'fullscreen',
  },
  render: (args) => (
    <TestGreenbacksProvider>
      <NoAccounts {...args} />
    </TestGreenbacksProvider>
  ),
  title: 'Pages/NoAccounts',
};

type Story = StoryObj<typeof NoAccounts>;

export const Default: Story = {};

export default meta;
