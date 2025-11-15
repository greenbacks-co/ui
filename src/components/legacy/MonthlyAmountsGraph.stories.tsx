import { DateTime } from 'luxon';
import type { Meta, StoryObj } from '@storybook/react';

import { MonthlyAmountsGraph } from './MonthlyAmountsGraph';

const meta: Meta<React.ComponentProps<typeof MonthlyAmountsGraph>> = {
  args: {
    monthlyAmountsBySeriesName: {
      Spending: [
        { amount: 100000, month: DateTime.fromISO('2020-01') },
        { amount: 200000, month: DateTime.fromISO('2020-02') },
        { amount: 400000, month: DateTime.fromISO('2020-03') },
        { amount: 200000, month: DateTime.fromISO('2020-04') },
        { amount: 300000, month: DateTime.fromISO('2020-05') },
        { amount: 200000, month: DateTime.fromISO('2020-06') },
        { amount: 200000, month: DateTime.fromISO('2020-07') },
        { amount: 400000, month: DateTime.fromISO('2020-08') },
        { amount: 100000, month: DateTime.fromISO('2020-09') },
        { amount: 300000, month: DateTime.fromISO('2020-10') },
        { amount: 300000, month: DateTime.fromISO('2020-11') },
        { amount: 100000, month: DateTime.fromISO('2020-12') },
      ],
    },
  },
  component: MonthlyAmountsGraph,
  parameters: {
    layout: 'centered',
  },
  title: 'Molecules/MonthlyAmountsGraph',
};

type Story = StoryObj<typeof MonthlyAmountsGraph>;

export const Default: Story = {};

export const TwoLines: Story = {
  args: {
    monthlyAmountsBySeriesName: {
      Saving: [
        { amount: 100000, month: DateTime.fromISO('2020-01') },
        { amount: 100000, month: DateTime.fromISO('2020-02') },
        { amount: 200000, month: DateTime.fromISO('2020-03') },
        { amount: 100000, month: DateTime.fromISO('2020-04') },
        { amount: 100000, month: DateTime.fromISO('2020-05') },
        { amount: 200000, month: DateTime.fromISO('2020-06') },
        { amount: 100000, month: DateTime.fromISO('2020-07') },
        { amount: 300000, month: DateTime.fromISO('2020-08') },
        { amount: 100000, month: DateTime.fromISO('2020-09') },
        { amount: 0, month: DateTime.fromISO('2020-10') },
        { amount: 100000, month: DateTime.fromISO('2020-11') },
        { amount: 100000, month: DateTime.fromISO('2020-12') },
      ],
      Spending: [
        { amount: 100000, month: DateTime.fromISO('2020-01') },
        { amount: 200000, month: DateTime.fromISO('2020-02') },
        { amount: 400000, month: DateTime.fromISO('2020-03') },
        { amount: 200000, month: DateTime.fromISO('2020-04') },
        { amount: 300000, month: DateTime.fromISO('2020-05') },
        { amount: 200000, month: DateTime.fromISO('2020-06') },
        { amount: 200000, month: DateTime.fromISO('2020-07') },
        { amount: 400000, month: DateTime.fromISO('2020-08') },
        { amount: 100000, month: DateTime.fromISO('2020-09') },
        { amount: 300000, month: DateTime.fromISO('2020-10') },
        { amount: 300000, month: DateTime.fromISO('2020-11') },
        { amount: 100000, month: DateTime.fromISO('2020-12') },
      ],
    },
    seriesConfigurationByName: {
      Saving: {
        colour: 'green',
      },
    },
  },
};

export const WithHoles: Story = {
  args: {
    monthlyAmountsBySeriesName: {
      Spending: [
        { amount: 10000, month: DateTime.fromISO('2020-01') },
        { amount: 40000, month: DateTime.fromISO('2020-03') },
        { amount: 30000, month: DateTime.fromISO('2020-05') },
        { amount: 20000, month: DateTime.fromISO('2020-07') },
        { amount: 10000, month: DateTime.fromISO('2020-09') },
        { amount: 30000, month: DateTime.fromISO('2020-10') },
        { amount: 10000, month: DateTime.fromISO('2020-12') },
      ],
    },
    seriesConfigurationByName: {
      Saving: {
        colour: 'green',
      },
    },
  },
};

export default meta;
