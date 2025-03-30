import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Funnel, FunnelContainer } from 'components/Funnel';
import { TestFiltersProvider } from 'context/Filters';
import { DemoApiProvider } from 'context/GreenbacksApi';
import RouteProvider from 'context/Route';
import { buildFilter, buildMatcher } from '__test__/utils/buildFilter';

const meta: Meta<React.ComponentProps<typeof Funnel>> = {
  args: {
    bills: 400000,
    discretionary: 300000,
    earning: 1000000,
    isLoading: false,
    saving: 500000,
  },
  component: Funnel,
  parameters: {
    layout: 'centered',
  },
  title: 'Molecules/Funnel',
};

type Story = StoryObj<typeof Funnel>;

export const Default: Story = {};

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
          <FunnelContainer />
        </TestFiltersProvider>
      </DemoApiProvider>
    </RouteProvider>
  );
}

export default meta;
