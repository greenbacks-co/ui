import React, { FC } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

import useNow from 'hooks/useNow';
import useProjectedRemainingSpending from 'hooks/useProjectedRemainingSpending';
import useTotalsByMonth, { MonthTotals } from 'hooks/useTotalsByMonth';
import useTotalSpending from 'hooks/useTotalSpending';
import getMonth from 'utils/getMonth';
import LoadingIndicator from '../atoms/LoadingIndicator';

const MonthlySpendingGraph: FC = () => {
  const { now } = useNow();
  const {
    firstDay,
    lastDay,
    readable: readableMonth,
  } = getMonth({
    datetime: now,
  });
  const { isLoading: isLoadingTotalsByMonth, totalsByMonth } =
    useTotalsByMonth();
  const { isLoading: isLoadingSpending, totalSpending: currentMonthSpending } =
    useTotalSpending({
      endDate: lastDay,
      startDate: firstDay,
    });
  const {
    isLoading: isLoadingProjectedRemainingSpending,
    projectedRemainingSpending,
  } = useProjectedRemainingSpending({
    dayInMonth: now.day,
    daysInMonth: now.daysInMonth,
  });

  if (
    isLoadingTotalsByMonth ||
    isLoadingSpending ||
    isLoadingProjectedRemainingSpending
  )
    return <LoadingIndicator name="monthly-spending-graph" />;

  const graphData = formatData({
    currentMonthSpending,
    projectedRemainingCurrentMonthSpending: projectedRemainingSpending,
    readableMonth,
    totalsByMonth,
  });

  return (
    <>
      <div
        data-testid="monthly-spending-graph"
        {...getDataTags({ totalsByMonth })}
      />
      <ResponsiveContainer aspect={1.5} minWidth={300} width="100%">
        <BarChart barGap={0} data={graphData}>
          <CartesianGrid strokeDasharray="2 4" vertical={false} />
          <Bar dataKey="spending" fill="orange" stackId="a" />
          <Bar dataKey="projectedRemainingSpending" fill="grey" stackId="a" />
          <XAxis dataKey="name" interval="preserveStartEnd" reversed />
          <YAxis
            axisLine={false}
            tickFormatter={(amount) => {
              if (amount < 100000) return `${amount / 100}`;
              return `${amount / 100000}k`;
            }}
            tickLine={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

const getDataTags = ({ totalsByMonth }: { totalsByMonth?: MonthTotals[] }) =>
  totalsByMonth?.reduce((dataTags, { month, spending }) => {
    const key = `data-${month.replace(' ', '-')}`.toLowerCase();
    return {
      ...dataTags,
      [key]: spending,
    };
  }, {});

const formatData = ({
  currentMonthSpending,
  projectedRemainingCurrentMonthSpending,
  readableMonth,
  totalsByMonth,
}: {
  currentMonthSpending?: number;
  projectedRemainingCurrentMonthSpending?: number;
  readableMonth: string;
  totalsByMonth?: MonthTotals[];
}): {
  name: string;
  spending: number;
  projectedRemainingSpending?: number;
}[] => {
  if (
    currentMonthSpending === undefined ||
    projectedRemainingCurrentMonthSpending === undefined ||
    !totalsByMonth
  )
    return [];
  const result = [
    {
      name: readableMonth,
      spending: currentMonthSpending,
      projectedRemainingSpending: projectedRemainingCurrentMonthSpending,
    },
    ...totalsByMonth.map(({ month, spending }) => ({
      name: month,
      spending: spending || 0,
    })),
  ];
  return result;
};

export default MonthlySpendingGraph;
