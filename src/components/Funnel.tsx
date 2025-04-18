import React from 'react';
import {
  Bar,
  BarChart,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  YAxis,
} from 'recharts';

import useMonth from 'hooks/useMonth';
import useTransactionsByCategory from 'hooks/useTransactionsByCategory';
import type Transaction from 'types/transaction';
import { GroupBy, groupTransactions } from 'utils/groupTransactions';

export function Funnel({
  bills = 0,
  discretionary = 0,
  earning = 0,
  isLoading = false,
  saving = 0,
}: {
  bills?: number;
  discretionary?: number;
  earning?: number;
  isLoading?: boolean;
  saving?: number;
}): React.ReactElement {
  if (isLoading) return <p>loading</p>;
  const afterSaving = earning - saving;
  const afterBills = afterSaving - bills;
  const afterDiscretionary = afterBills - discretionary;
  const data = [
    {
      earning,
      name: 'earning',
    },
    {
      name: 'saving',
      saving,
      remainder: afterSaving,
    },
    {
      bills,
      name: 'bills',
      remainder: afterBills,
    },
    ...(discretionary > 0
      ? [
          {
            discretionary,
            name: 'discretionary',
            remainder: afterDiscretionary,
          },
        ]
      : []),
  ];
  const ticks = [earning, afterSaving, afterBills, 0, afterDiscretionary].sort(
    (a, b) => (a > b ? -1 : 1),
  );
  return (
    <ResponsiveContainer
      aspect={1}
      height="max-content"
      minWidth={400}
      width="100%"
    >
      <BarChart data={data} margin={{ left: 40, right: 40, top: 20 }}>
        <ReferenceLine stroke="grey" y={0} />
        <ReferenceLine stroke="lightgrey" y={earning} />
        <ReferenceLine stroke="lightgrey" y={afterSaving} />
        <ReferenceLine stroke="lightgrey" y={afterBills} />
        <ReferenceLine stroke="lightgrey" y={afterDiscretionary} />
        <Bar dataKey="remainder" fill="grey" stackId="a" />
        <Bar dataKey="earning" fill="green" stackId="a" />
        <Bar dataKey="saving" fill="blue" stackId="a">
          <LabelList
            formatter={formatThousands}
            dataKey="saving"
            position="top"
          />
        </Bar>
        <Bar dataKey="bills" fill="yellow" stackId="a">
          <LabelList
            formatter={formatThousands}
            dataKey="bills"
            position="top"
          />
        </Bar>
        <Bar dataKey="discretionary" fill="orange" stackId="a">
          <LabelList
            formatter={formatThousands}
            dataKey="discretionary"
            position="top"
          />
        </Bar>
        <YAxis
          axisLine={false}
          tickFormatter={formatThousands}
          tickLine={false}
          ticks={ticks}
        />
        <YAxis
          axisLine={false}
          orientation="right"
          tickFormatter={formatThousands}
          tickLine={false}
          ticks={ticks}
          yAxisId="second"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

function formatThousands(cents: number): string {
  const dollars = cents / 100;
  if (Math.abs(dollars) < 1000) return Math.round(dollars).toString();
  const hundreds = Math.round(dollars / 100);
  return `${hundreds / 10}k`;
}

export function FunnelContainer(): React.ReactElement {
  const { endDate, startDate } = useMonth();
  const { earning, isLoading, saving, spending } = useTransactionsByCategory({
    endDate,
    startDate,
  });
  const groups = groupTransactions({
    groupBy: GroupBy.Variability,
    transactions: spending,
  });
  const groupsByVariability: Partial<{ Fixed: number; Variable: number }> =
    groups?.reduce<Partial<{ Fixed: number; Variable: number }>>(
      (result, group) => ({
        ...result,
        [group.key]: group.total,
      }),
      {},
    ) ?? {};
  return (
    <Funnel
      bills={groupsByVariability.Fixed}
      discretionary={groupsByVariability.Variable}
      earning={getTotal(earning)}
      isLoading={isLoading}
      saving={getTotal(saving)}
    />
  );
}

function getTotal(transactions: Transaction[] | undefined): number {
  if (transactions === undefined) return 0;
  return transactions.reduce(
    (total, transaction) => total + transaction.amount,
    0,
  );
}
