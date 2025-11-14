import React, { FC, useState } from 'react';
import { DateTime } from 'luxon';
import {
  CartesianGrid,
  LabelList,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

import MonthSelector from 'components/MonthSelector';
import useMonth from 'hooks/useMonth';
import useNow from 'hooks/useNow';
import useSpendingTimeline, { DailyTotal } from 'hooks/useSpendingTimeline';
import Transaction from 'types/transaction';
import RadioButtons from './atoms/RadioButtons';
import LoadingIndicator from './atoms/LoadingIndicator';

const PreviousMonthSpending: FC = () => {
  const {
    endDate: serializedMonthEnd,
    iso: serializedMonth,
    startDate: serializedMonthStart,
  } = useMonth();
  const month = DateTime.fromISO(serializedMonth);
  const { now } = useNow();
  const [selectedAverage, setSelectedAverage] = useState<string>('3');
  const monthsToAverage = parseInt(selectedAverage, 10);
  const {
    averageSpendingByDayOfMonth,
    isLoading,
    rawActualTransactions,
    timeline,
  } = useSpendingTimeline({
    month: serializedMonth,
    monthsToAverage,
  });

  const averageSpendingByDate = Object.entries(
    averageSpendingByDayOfMonth ?? {},
  ).reduce((result, [day, spending]) => {
    const date = month.set({ day: parseInt(day, 10) }).toISODate();
    return { ...result, [date]: spending };
  }, {});

  const monthStart = DateTime.fromISO(serializedMonthStart);
  const monthEnd = DateTime.fromISO(serializedMonthEnd);

  if (isLoading) return <LoadingIndicator />;

  if (!timeline) return <p>error</p>;

  const dataTags = getDataTags({ timeline });

  return (
    <>
      <h2>Spending Timeline</h2>
      <MonthSelector />
      <div data-testid="spending-timeline-graph" {...dataTags} />
      <PureSpendingTimeline
        comparisonSpendingByDate={averageSpendingByDate}
        endDate={monthEnd}
        latestActualDate={now}
        transactions={rawActualTransactions ?? []}
        startDate={monthStart}
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
    </>
  );
};

const getDataTags = ({
  timeline,
}: {
  timeline?: DailyTotal[];
}): Record<string, string> => {
  if (!timeline) return {};
  return timeline.reduce((tags, { actual, average, day, projected }) => {
    const paddedDay = String(day).padStart(2, '0');
    const result: Record<string, number> = {
      ...tags,
      [`data-${paddedDay}-average`]: average,
    };
    if (actual) result[`data-${paddedDay}-actual`] = actual;
    if (projected) result[`data-${paddedDay}-projected`] = projected;
    return result;
  }, {});
};

function formatThousands(cents: number): string {
  const dollars = cents / 100;
  if (dollars < 1000) return Math.round(dollars).toString();
  const hundreds = Math.round(dollars / 100);
  return `${hundreds / 10}k`;
}

export function PureSpendingTimeline({
  comparisonLabel = 'comparison',
  comparisonSpendingByDate = {},
  endDate,
  hasComparison = true,
  hasLastActualReferenceLine = true,
  hasLastPredictedReferenceLine = true,
  hasPredicted = true,
  hasXAxis = true,
  hasXLines = false,
  hasYAxis = false,
  latestActualDate,
  startDate,
  transactions = [],
}: {
  comparisonLabel?: string;
  comparisonSpendingByDate?: Record<string, number>;
  endDate?: DateTime;
  hasComparison?: boolean;
  hasLastActualReferenceLine?: boolean;
  hasLastPredictedReferenceLine?: boolean;
  hasPredicted?: boolean;
  hasXAxis?: boolean;
  hasXLines?: boolean;
  hasYAxis?: boolean;
  latestActualDate?: DateTime;
  startDate?: DateTime;
  transactions?: Transaction[];
}): React.ReactElement {
  const {
    earliestDate: earliestObservedDate,
    latestDate: latestObservedDate,
    latestTransactionDate,
  } = findObservedDateRange({
    comparisonSpendingByDate,
    transactions,
  });
  const startDateOrDefault = startDate ?? earliestObservedDate;
  const endDateOrDefault = endDate ?? latestObservedDate;
  const latestActualDateOrDefault = latestActualDate ?? latestTransactionDate;
  const timeline = buildTimeline({
    comparisonSpendingByDate,
    endDate: endDateOrDefault,
    latestActualDate: latestActualDateOrDefault,
    startDate: startDateOrDefault,
    transactions,
  });
  const serializedLatestDate = endDateOrDefault.toISODate();
  const serializedLatestActualDate = latestActualDateOrDefault.toISODate();
  const lastDay = timeline[timeline.length - 1];
  const lastActualDay = timeline.find(
    (day) => day.date === serializedLatestActualDate,
  );
  const hasComparisonData = Object.keys(comparisonSpendingByDate).length > 0;
  return (
    <ResponsiveContainer
      aspect={2}
      height="max-content"
      minWidth={250}
      width="100%"
    >
      <LineChart data={timeline}>
        {hasXLines && <CartesianGrid vertical={false} />}
        {hasPredicted &&
          hasLastPredictedReferenceLine &&
          hasComparisonData &&
          lastDay?.projected !== undefined && (
            <ReferenceLine
              label={{
                fontSize: '0.8rem',
                value: formatThousands(lastDay.projected),
              }}
              stroke="lightgrey"
              y={lastDay.projected}
            />
          )}
        {hasLastActualReferenceLine &&
          lastActualDay &&
          lastActualDay.actual !== undefined && (
            <ReferenceLine
              label={{
                fontSize: '0.8rem',
                value: formatThousands(lastActualDay.actual),
              }}
              stroke="lightgrey"
              y={lastActualDay.actual}
            />
          )}
        {hasComparison && hasComparisonData && (
          <Line
            dataKey="comparison"
            dot={false}
            isAnimationActive={false}
            stroke="orange"
          />
        )}
        <Line dataKey="actual" dot={false} isAnimationActive={false}>
          <LabelList
            formatter={formatThousands}
            style={{
              fontSize: '0.8rem',
            }}
            valueAccessor={(entry: {
              payload: { date: string };
              value: number;
            }) => {
              if (entry.payload.date === serializedLatestActualDate)
                return entry.value;
              return null;
            }}
          />
        </Line>
        {hasPredicted && hasComparisonData && (
          <Line
            dataKey="projected"
            dot={false}
            isAnimationActive={false}
            strokeDasharray="4 4"
          >
            <LabelList
              formatter={formatThousands}
              style={{
                fontSize: '0.8rem',
              }}
              valueAccessor={(entry: {
                payload: { date: string };
                value: number;
              }) => {
                if (entry.payload.date === serializedLatestDate)
                  return entry.value;
                return null;
              }}
            />
          </Line>
        )}
        {hasXAxis && (
          <XAxis
            dataKey="date"
            interval="preserveStartEnd"
            tick={{ fontSize: '0.8rem' }}
            tickFormatter={(value) =>
              DateTime.fromISO(value).toLocaleString({
                day: 'numeric',
                month: 'short',
              })
            }
            ticks={[
              startDateOrDefault.toISODate(),
              endDateOrDefault.toISODate(),
            ]}
          />
        )}
        {hasYAxis && (
          <YAxis
            axisLine={false}
            tickCount={3}
            tickFormatter={formatThousands}
            tickLine={false}
            width={30}
          />
        )}
        <Legend
          align="center"
          formatter={(value) => {
            if (value !== 'comparison') return value;
            if (comparisonLabel === undefined) return value;
            return comparisonLabel;
          }}
          iconType="plainline"
          wrapperStyle={{ fontSize: '0.8rem' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function buildTimeline({
  comparisonSpendingByDate = {},
  endDate,
  latestActualDate,
  startDate,
  transactions,
}: {
  comparisonSpendingByDate?: Record<string, number>;
  endDate: DateTime;
  latestActualDate: DateTime;
  startDate: DateTime;
  transactions: Transaction[];
}): DailyAmounts[] {
  const serializedLatestActualDate = latestActualDate.toISODate();
  const totalsByDate = transactions.reduce<Record<string, number>>(
    (result, transaction) => {
      const currentTotal = result[transaction.datetime] ?? 0;
      return {
        ...result,
        [transaction.datetime]: currentTotal + transaction.amount,
      };
    },
    {},
  );
  const dailyTotals: DailyAmounts[] = [];
  for (let d = startDate; d <= endDate; d = d.plus({ days: 1 })) {
    const serializedDate = d.toISODate();
    dailyTotals.push({
      actual: totalsByDate[serializedDate] ?? 0,
      comparison: comparisonSpendingByDate[serializedDate] ?? 0,
      date: serializedDate,
    });
  }
  const cumulativeDailyTotals: DailyAmounts[] = [];
  for (let i = 0; i < dailyTotals.length; i += 1) {
    const currentRecord = dailyTotals[i];
    const previousRecord = cumulativeDailyTotals[i - 1];
    const previousActual = i === 0 ? 0 : previousRecord.actual;
    const currentActual = currentRecord.actual;
    const newActual = getNewDailyTotal(previousActual, currentActual);
    const previousComparison = i === 0 ? 0 : previousRecord.comparison;
    const currentComparison = currentRecord.comparison;
    const newComparison = getNewDailyTotal(
      previousComparison,
      currentComparison,
    );
    const previousPredicted = i === 0 ? 0 : previousRecord.projected;
    const currentPredicted = currentComparison;
    const newPredicted = getNewDailyTotal(previousPredicted, currentPredicted);
    cumulativeDailyTotals[i] = {
      comparison: newComparison,
      date: currentRecord.date,
    };
    if (currentRecord.date < serializedLatestActualDate) {
      cumulativeDailyTotals[i].actual = newActual;
    }
    if (currentRecord.date === serializedLatestActualDate) {
      cumulativeDailyTotals[i].actual = newActual;
      cumulativeDailyTotals[i].projected = newActual;
    }
    if (currentRecord.date > serializedLatestActualDate) {
      cumulativeDailyTotals[i].projected = newPredicted;
    }
  }
  return cumulativeDailyTotals;
}

interface DailyAmounts {
  actual?: number;
  comparison?: number;
  date: string;
  projected?: number;
}

function findObservedDateRange({
  comparisonSpendingByDate,
  transactions,
}: {
  comparisonSpendingByDate: Record<string, number>;
  transactions: Transaction[];
}): {
  earliestDate: DateTime;
  latestDate: DateTime;
  latestTransactionDate: DateTime;
} {
  const { earliest: earliestTransactionDate, latest: latestTransactionDate } =
    findRangeFromDateList({
      dates: transactions.map((transaction) => transaction.datetime),
    });
  const comparisonDates = Object.keys(comparisonSpendingByDate);
  if (comparisonDates.length === 0)
    return {
      earliestDate: earliestTransactionDate,
      latestDate: latestTransactionDate,
      latestTransactionDate,
    };
  const { earliest: earliestComparisonDate, latest: latestComparisonDate } =
    findRangeFromDateList({ dates: Object.keys(comparisonSpendingByDate) });
  const earliestDate =
    earliestTransactionDate < earliestComparisonDate
      ? earliestTransactionDate
      : earliestComparisonDate;
  const latestDate =
    latestTransactionDate > latestComparisonDate
      ? latestTransactionDate
      : latestComparisonDate;
  return {
    earliestDate,
    latestDate,
    latestTransactionDate,
  };
}

function findRangeFromDateList({ dates }: { dates: string[] }): {
  earliest: DateTime;
  latest: DateTime;
} {
  let earliest = dates[0];
  let latest = earliest;
  dates.forEach((date) => {
    if (date < earliest) earliest = date;
    if (date > latest) latest = date;
  });
  return {
    earliest: DateTime.fromISO(earliest),
    latest: DateTime.fromISO(latest),
  };
}

function getNewDailyTotal(
  total: number | undefined,
  current: number | undefined,
): number {
  return (total ?? 0) + (current ?? 0);
}

export default PreviousMonthSpending;
