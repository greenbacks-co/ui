import React, { FC, useState } from 'react';
import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

import ArticleContainer from 'components/ArticleContainer';
import MonthSelector from 'components/MonthSelector';
import RadioButtons from 'components/RadioButtons';
import useAverageMonthlyEarning from 'hooks/useAverageMonthlyEarning';
import useAverageMonthlySaving from 'hooks/useAverageMonthlySaving';
import useAverageMonthlySpending from 'hooks/useAverageMonthlySpending';
import useMonth from 'hooks/useMonth';
import useTransactionsByCategory from 'hooks/useTransactionsByCategory';
import Transaction from 'types/transaction';
import LoadingIndicator from './atoms/LoadingIndicator';

const CashFlow: FC = () => {
  const { endDate, startDate } = useMonth();
  const [selectedAverage, setSelectedAverage] = useState<string>('12');
  const monthsToAverage = parseInt(selectedAverage, 10);
  const { averageMonthlyEarning, isLoading: isLoadingAverageEarning } =
    useAverageMonthlyEarning({ months: monthsToAverage });
  const { averageMonthlySpending, isLoading: isLoadingAverageSpending } =
    useAverageMonthlySpending({ months: monthsToAverage });
  const { averageMonthlySaving, isLoading: isLoadingAverageSaving } =
    useAverageMonthlySaving({ months: monthsToAverage });
  const {
    earning,
    isLoading: isLoadingMonthTransactions,
    saving,
    spending,
  } = useTransactionsByCategory({
    endDate,
    startDate,
  });
  const {
    earning: totalEarning,
    saving: totalSaving,
    spending: totalSpending,
  } = getTotals({ earning, saving, spending });

  const isLoading =
    isLoadingAverageEarning ||
    isLoadingAverageSaving ||
    isLoadingAverageSpending;

  if (isLoading) return <LoadingIndicator />;

  return (
    <ArticleContainer id="cashflow" title="Cashflow">
      <h3>This Month&apos;s Cashflow</h3>
      <MonthSelector />
      {isLoadingMonthTransactions && <p>loading</p>}
      {!isLoadingMonthTransactions && (
        <Graph
          earning={totalEarning}
          saving={totalSaving}
          spending={totalSpending}
        />
      )}
      <h3>Average Cashflow</h3>
      <Graph
        earning={averageMonthlyEarning}
        saving={averageMonthlySaving}
        spending={averageMonthlySpending}
      />
      <RadioButtons
        onChange={(value) => setSelectedAverage(value)}
        options={[
          { label: '3 month average', value: '3' },
          { label: '6 month average', value: '6' },
          { label: '12 month average', value: '12' },
        ]}
        value={selectedAverage}
      />
    </ArticleContainer>
  );
};

const Graph: FC<{
  earning?: number;
  saving?: number;
  spending?: number;
}> = ({ earning = 0, saving = 0, spending = 0 }) => (
  <ResponsiveContainer
    aspect={3}
    height="max-content"
    minWidth={300}
    width="100%"
  >
    <BarChart data={[{ earning, saving, spending }]} layout="vertical">
      <Bar dataKey="earning" fill="green" stackId="a">
        <LabelList
          formatter={(label: number) => {
            const hundreds = Math.round(label / 10000);
            return `${hundreds / 10}k`;
          }}
          position="right"
        />
      </Bar>
      <Bar dataKey="saving" fill="blue" stackId="b">
        <LabelList
          formatter={(label: number) => {
            const hundreds = Math.round(label / 10000);
            return `${hundreds / 10}k`;
          }}
        />
      </Bar>
      <Bar dataKey="spending" fill="orange" stackId="b">
        <LabelList
          formatter={(label: number) => {
            const hundreds = Math.round(label / 10000);
            return `${hundreds / 10}k`;
          }}
          valueAccessor={(entry: { spending: number }) => entry.spending}
        />
        <LabelList
          formatter={(label: number) => {
            const hundreds = Math.round(label / 10000);
            return `${hundreds / 10}k`;
          }}
          position="right"
        />
      </Bar>
      <XAxis
        padding={{ right: 20 }}
        tickFormatter={(amount) => {
          if (amount < 100000) return `${amount / 100}`;
          return `${amount / 100000}k`;
        }}
        type="number"
      />
      <YAxis dataKey="label" hide type="category" />
    </BarChart>
  </ResponsiveContainer>
);

function getTotals({
  earning,
  saving,
  spending,
}: {
  earning?: Transaction[];
  saving?: Transaction[];
  spending?: Transaction[];
}): { earning?: number; saving?: number; spending?: number } {
  return {
    earning: getTotal(earning),
    saving: getTotal(saving),
    spending: getTotal(spending),
  };
}

function getTotal(transactions: Transaction[] | undefined): number | undefined {
  return transactions?.reduce(
    (total, transaction) => total + transaction.amount,
    0,
  );
}

export default CashFlow;
