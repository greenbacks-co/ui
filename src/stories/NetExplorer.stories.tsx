import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { NetExplorer, NetExplorerMonthContainer } from 'components/NetExplorer';
import { TestFiltersProvider } from 'context/Filters';
import { DemoApiProvider } from 'context/GreenbacksApi';
import RouteProvider from 'context/Route';
import { buildFilter, buildMatcher } from '__test__/utils/buildFilter';

const meta: Meta<React.ComponentProps<typeof NetExplorer>> = {
  args: {
    isLoading: false,
    onChangeTagVisibility: fn(),
    onClickNext: fn(),
    onClickPrevious: fn(),
    period: 'January',
    tags: {
      Salary: 300000,
      Rent: -200000,
      Groceries: -50000,
    },
    tagVisibility: { Rent: true },
    total: 100000,
  },
  component: NetExplorer,
  parameters: {
    layout: 'centered',
  },
  title: 'Molecules/NetExplorer',
};

type Story = StoryObj<typeof NetExplorer>;

export const Default: Story = {};

export const Loading: Story = {
  args: { isLoading: true },
};

export const InContainer: Story = {
  render: () => <Container />,
};

function Container(): React.ReactElement {
  return (
    <RouteProvider>
      <DemoApiProvider>
        <TestFiltersProvider
          filters={[
            buildFilter({
              matchers: [
                buildMatcher({
                  property: 'name',
                  expectedValue: 'Direct Deposit from Work Co',
                }),
              ],
              tagToAssign: 'Salary',
            }),
          ]}
        >
          <NetExplorerMonthContainer />
        </TestFiltersProvider>
      </DemoApiProvider>
    </RouteProvider>
  );
}

export default meta;
