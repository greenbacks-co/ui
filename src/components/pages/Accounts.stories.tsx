import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Accounts from './Accounts';
import { Page } from '../molecules/Page';
import { TestGreenbacksProvider } from '../../context/Greenbacks';
import type { Account } from '../../hooks/useAccounts';

const meta: Meta<React.ComponentProps<typeof Accounts>> = {
  args: {
    accounts: [
      buildAccount({ id: '1', institution: { name: 'CIBC' } }),
      buildAccount({ id: '2', institution: { name: 'American Express' } }),
    ],
  },
  component: Accounts,
  decorators: (Story) => (
    <TestGreenbacksProvider>
      <Page>
        <Story />
      </Page>
    </TestGreenbacksProvider>
  ),
  parameters: {
    layout: 'fullscreen',
  },
  title: 'Pages/Accounts',
};

function buildAccount({
  createdDate = '2020-01-01',
  id = '1',
  modifiedDate = '2020-01-01',
  institution = { name: 'CIBC' },
  isReauthenticationRequired = false,
}: Partial<Account> = {}): Account {
  return {
    createdDate,
    id,
    modifiedDate,
    institution,
    isReauthenticationRequired,
  };
}

type Story = StoryObj<typeof Accounts>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    isLoadingAccounts: true,
  },
};

export const ReauthenticationRequired: Story = {
  args: {
    accounts: [
      buildAccount({
        id: '1',
        institution: { name: 'CIBC' },
        isReauthenticationRequired: true,
      }),
      buildAccount({
        id: '2',
        institution: { name: 'American Express' },
        isReauthenticationRequired: false,
      }),
    ],
  },
};

export default meta;
