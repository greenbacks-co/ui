import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Month, TotalsByMonth } from 'components/NewTotalsByMonth';

const meta: Meta<React.ComponentProps<typeof TotalsByMonth>> = {
  args: {
    monthTotals: buildMonthTotals(),
  },
  component: TotalsByMonth,
  parameters: {
    layout: 'centered',
  },
  title: 'Molecules/NewTotalsByMonth',
};

export function buildMonthTotals(): Month[] {
  const result = [];
  for (let i = 0; i < 12; i += 1) {
    const earning = 400000 * getMultiplier(0.2);
    const saving = 150000 * getMultiplier(0.05);
    const fixedSpending = 200000 * getMultiplier(0.2);
    const variableSpending = 100000 * getMultiplier(0.8);
    const spending = fixedSpending + variableSpending;
    const afterSaving = earning - saving;
    const afterFixedSpending = afterSaving - fixedSpending;
    const afterVariableSpending = afterFixedSpending - variableSpending;
    const net = earning - (saving + spending);
    result.push({
      afterFixedSpending,
      afterSaving,
      afterVariableSpending,
      earning,
      fixedSpending,
      month: `2024-${String(i + 1).padStart(2, '0')}`,
      net,
      saving,
      spending,
      variableSpending,
    });
  }
  return result;
}

function getMultiplier(range: number): number {
  return Math.random() * range + 1;
}

type Story = StoryObj<typeof TotalsByMonth>;

export const Default: Story = {};

export default meta;
