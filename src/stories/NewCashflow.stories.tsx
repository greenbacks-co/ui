import type { Meta, StoryObj } from '@storybook/react';

import { CashflowTimeline } from 'components/CashflowTimeline';
import type { Totals } from 'components/NewCashflow';

const meta: Meta<typeof CashflowTimeline> = {
  args: {
    totals: buildTotals(),
  },
  component: CashflowTimeline,
  parameters: {
    layout: 'centered',
  },
  title: 'Molecules/CashflowTimeline',
};

type Story = StoryObj<typeof CashflowTimeline>;

function buildTotals(): Totals[] {
  const result: Totals[] = [];
  let earning = 0;
  let saving = 0;
  let bills = 0;
  let fun = 0;
  for (let i = 0; i < 30; i += 1) {
    if (i === 0 || i === 14) earning += 200000 * getMultiplier(0.2);
    if (randomChance(0.2)) earning += 10000;
    if (i === 0) saving += 100000;
    if (i === 14) bills += 150000;
    if (randomChance(0.4)) bills += 5000 * getMultiplier(0.3);
    if (randomChance(0.8)) fun += 10000 * getMultiplier(0.5);
    const afterSaving = earning - saving;
    const afterBills = afterSaving - bills;
    const afterFun = afterBills - fun;
    result.push({
      earning,
      fixedSpending: [afterSaving, afterBills],
      key: `${i + 1}`,
      saving: [earning, afterSaving],
      variableSpending: [afterBills, afterFun],
      afterVariableSpending: afterFun,
    });
  }
  return result;
}

function getMultiplier(range: number): number {
  return Math.random() * range + 1;
}

function randomChance(chance: number): boolean {
  return Math.random() < chance;
}

export const Default: Story = {};

export default meta;
