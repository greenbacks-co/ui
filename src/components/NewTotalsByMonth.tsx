import { DateTime } from 'luxon';
import styled from 'styled-components';
import React, { ReactElement } from 'react';
import {
  Area,
  ComposedChart,
  LabelList,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
} from 'recharts';

import useTransactionsByCategory from 'hooks/useTransactionsByCategory';
import useNow from 'hooks/useNow';
import Transaction from 'types/transaction';
import { Variability } from 'types/variability';
import { formatThousands } from 'utils/formatThousands';
import groupTransactions, { GroupBy } from 'utils/groupTransactions';
import { Panel, PanelItem } from './Panel';
import { Text } from './Text';

export function TotalsByMonth({
  monthTotals = [],
}: {
  monthTotals?: Month[];
}): ReactElement {
  const shouldLabelAll = true;
  const earliestMonth = monthTotals[0]?.month ?? '';
  const latestMonth = monthTotals[monthTotals.length - 1]?.month ?? '';
  const hasNegative = monthTotals.some(
    (monthTotal) => (monthTotal[Series.AfterVariableSpending] ?? 0) < 0,
  );
  const monthsToLabelBySeries = getMonthsToLabel(monthTotals);
  return (
    <ResponsiveContainer aspect={3.2} minWidth={400} width="100%">
      <ComposedChart data={[...formatDataForAreaChart(monthTotals)].reverse()}>
        <Line
          dataKey={Series.Earning}
          dot={false}
          stroke={COLOURS_BY_SERIES[Series.Earning]}
          strokeWidth={2}
        >
          {shouldLabelAll ? (
            <LabelList
              formatter={formatThousands}
              position="top"
              style={{
                fontSize: '0.6rem',
              }}
            />
          ) : (
            <LabelList
              formatter={formatThousands}
              style={{
                fontSize: '0.8rem',
              }}
              valueAccessor={(entry: {
                payload: { month: string };
                value: number;
              }) => {
                if (
                  entry.payload.month === monthsToLabelBySeries[Series.Earning]
                )
                  return entry.value;
                return null;
              }}
            />
          )}
        </Line>
        <Area
          dataKey={Series.Saving}
          fill={COLOURS_BY_SERIES[Series.Saving]}
          stroke="none"
        />
        <Area
          dataKey={Series.FixedSpending}
          fill={COLOURS_BY_SERIES[Series.FixedSpending]}
          stroke="none"
        />
        <Area
          dataKey={Series.VariableSpending}
          fill={COLOURS_BY_SERIES[Series.VariableSpending]}
          stroke="none"
        />
        <Line
          dataKey={Series.AfterVariableSpending}
          dot={false}
          stroke={COLOURS_BY_SERIES[Series.AfterVariableSpending]}
          strokeWidth={2}
        >
          {shouldLabelAll ? (
            <LabelList
              formatter={formatThousands}
              position="bottom"
              style={{
                fontSize: '0.6rem',
              }}
            />
          ) : (
            <LabelList
              formatter={formatThousands}
              style={{
                fontSize: '0.8rem',
              }}
              valueAccessor={(entry: {
                payload: { month: string };
                value: number;
              }) => {
                if (
                  entry.payload.month === monthsToLabelBySeries[Series.Earning]
                )
                  return entry.value;
                return null;
              }}
            />
          )}
        </Line>
        {hasNegative && (
          <ReferenceLine
            label={{
              fontSize: '0.8rem',
              value: 0,
            }}
            stroke="grey"
            y={0}
          />
        )}
        <XAxis
          dataKey="month"
          interval="preserveStartEnd"
          reversed
          tick={{ fontSize: '0.8rem' }}
          tickFormatter={(value) =>
            DateTime.fromISO(value).toLocaleString({
              month: 'long',
              year: 'numeric',
            })
          }
          ticks={[earliestMonth, latestMonth]}
        />
        <Legend
          formatter={(value: Series) => LABELS_BY_SERIES[value] ?? value}
          iconType="plainline"
          wrapperStyle={{ fontSize: '0.8rem' }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export interface Month extends Partial<Record<Series, number>> {
  month: string;
}

function getMonthsToLabel(
  monthTotals: Month[],
): Partial<Record<Series, string>> {
  const maximums = monthTotals?.reduce<
    Partial<Record<Series, { maximum: number; month: string }>>
  >((result, month) => {
    const newResult = { ...result };
    Object.values(Series).forEach((series) => {
      const maximum = result[series]?.maximum ?? 0;
      const currentValue = Math.abs(month[series] ?? 0);
      if (currentValue >= maximum)
        newResult[series] = {
          maximum: currentValue,
          month: month.month,
        };
    });
    return newResult;
  }, {});
  return Object.entries(maximums).reduce(
    (result, [key, value]) => ({
      ...result,
      [key]: value.month,
    }),
    {},
  );
}

function formatDataForAreaChart(months: Month[]): {
  month: string;
  [Series.Earning]: number;
  [Series.FixedSpending]: number[];
  [Series.Saving]: number[];
  [Series.VariableSpending]: number[];
}[] {
  return months.map((month) => ({
    month: month.month,
    [Series.AfterVariableSpending]: month[Series.AfterVariableSpending] ?? 0,
    [Series.Earning]: month[Series.Earning] ?? 0,
    [Series.FixedSpending]: [
      month[Series.AfterSaving] ?? 0,
      month[Series.AfterFixedSpending] ?? 0,
    ],
    [Series.Saving]: [
      month[Series.Earning] ?? 0,
      month[Series.AfterSaving] ?? 0,
    ],
    [Series.VariableSpending]: [
      month[Series.AfterFixedSpending] ?? 0,
      month[Series.AfterVariableSpending] ?? 0,
    ],
  }));
}

enum Series {
  AfterFixedSpending = 'afterFixedSpending',
  AfterSaving = 'afterSaving',
  AfterVariableSpending = 'afterVariableSpending',
  Earning = 'earning',
  FixedSpending = 'fixedSpending',
  Saving = 'saving',
  Spending = 'spending',
  VariableSpending = 'variableSpending',
}

const COLOURS_BY_SERIES: Partial<Record<Series, string>> = {
  [Series.AfterFixedSpending]: 'darkorange',
  [Series.AfterSaving]: 'lightgreen',
  [Series.AfterVariableSpending]: 'purple',
  [Series.Earning]: 'darkgreen',
  [Series.FixedSpending]: 'orange',
  [Series.Saving]: 'lightblue',
  [Series.Spending]: 'red',
  [Series.VariableSpending]: 'gold',
};

const LABELS_BY_SERIES: Partial<Record<Series, string>> = {
  [Series.AfterFixedSpending]: 'Balance After Bills',
  [Series.AfterSaving]: 'Balance After Saving',
  [Series.AfterVariableSpending]: 'Total Cashflow',
  [Series.Earning]: 'Earning',
  [Series.FixedSpending]: 'Bills',
  [Series.Saving]: 'Saving',
  [Series.Spending]: 'Spending',
  [Series.VariableSpending]: 'Fun',
};

function TotalsByMonthPanel({
  area,
  monthTotals,
}: {
  area?: string;
  monthTotals: Month[];
}): ReactElement {
  return (
    <Wrapper $area={area}>
      <Panel>
        <PanelItem hasBottomBorder>
          <Text>Cashflow Trends</Text>
        </PanelItem>
        <PanelItem>
          <TotalsByMonth monthTotals={monthTotals} />
        </PanelItem>
      </Panel>
    </Wrapper>
  );
}

const Wrapper = styled.div<{ $area?: string }>`
  ${({ $area }) => $area && `grid-area: ${$area};`}
  width: 100%;
`;

export function TotalsByMonthPanelContainer({
  area,
}: {
  area?: string;
}): ReactElement {
  const { now } = useNow();
  const endDate = now.minus({ months: 1 }).endOf('month').toISODate();
  const startDate = now.minus({ months: 12 }).startOf('month').toISODate();
  const { earning, saving, spending } = useTransactionsByCategory({
    endDate,
    startDate,
  });
  const monthTotals = getMonthTotals({ earning, saving, spending });
  return <TotalsByMonthPanel area={area} monthTotals={monthTotals} />;
}

function getMonthTotals({
  earning = [],
  saving = [],
  spending = [],
}: {
  earning?: Transaction[];
  saving?: Transaction[];
  spending?: Transaction[];
}): Month[] {
  const spendingGroups =
    groupTransactions({
      groupBy: GroupBy.Variability,
      transactions: spending,
    }) ?? [];
  const fixedSpending =
    spendingGroups.find((group) => group.key === Variability.Fixed)
      ?.transactions ?? [];
  const variableSpending =
    spendingGroups.find((group) => group.key === Variability.Variable)
      ?.transactions ?? [];
  const earningByMonth = groupTransactions({
    groupBy: GroupBy.Month,
    transactions: earning,
  });
  const savingByMonth = groupTransactions({
    groupBy: GroupBy.Month,
    transactions: saving,
  });
  const fixedSpendingByMonth = groupTransactions({
    groupBy: GroupBy.Month,
    transactions: fixedSpending,
  });
  const variableSpendingByMonth = groupTransactions({
    groupBy: GroupBy.Month,
    transactions: variableSpending,
  });
  const totalsByMonth: Record<string, Month> = {};
  earningByMonth?.forEach((month) => {
    const totalsSoFar = totalsByMonth[month.key] ?? {};
    totalsByMonth[month.key] = {
      ...totalsSoFar,
      earning: month.total,
      month: month.key,
    };
  });
  savingByMonth?.forEach((month) => {
    const totalsSoFar = totalsByMonth[month.key] ?? {};
    totalsByMonth[month.key] = {
      ...totalsSoFar,
      saving: month.total,
      month: month.key,
    };
  });
  fixedSpendingByMonth?.forEach((month) => {
    const totalsSoFar = totalsByMonth[month.key] ?? {};
    totalsByMonth[month.key] = {
      ...totalsSoFar,
      fixedSpending: month.total,
      month: month.key,
    };
  });
  variableSpendingByMonth?.forEach((month) => {
    const totalsSoFar = totalsByMonth[month.key] ?? {};
    totalsByMonth[month.key] = {
      ...totalsSoFar,
      variableSpending: month.total,
      month: month.key,
    };
  });
  const result = Object.values(totalsByMonth)
    .sort((a, b) => (a.month > b.month ? 1 : -1))
    .map((month) => {
      const afterSaving = (month.earning ?? 0) - (month.saving ?? 0);
      const afterFixedSpending = afterSaving - (month.fixedSpending ?? 0);
      const afterVariableSpending =
        afterFixedSpending - (month.variableSpending ?? 0);
      return {
        ...month,
        afterFixedSpending,
        afterSaving,
        afterVariableSpending,
      };
    });
  return result;
}
