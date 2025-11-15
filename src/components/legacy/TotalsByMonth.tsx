import { DateTime } from 'luxon';
import React, { FC } from 'react';
import {
  LabelList,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
} from 'recharts';
import styled from 'styled-components';

import useCurrencyFormatter from 'hooks/useCurrencyFormatter';
import useMultiselect from 'hooks/useMultiselect';
import useTotalsByMonth, { MonthTotals } from 'hooks/useTotalsByMonth';
import Checkboxes from './Checkboxes';
import LoadingIndicator from '../atoms/LoadingIndicator';
import { Icon, IconType } from '../atoms/Icon';
import { Panel, PanelItem } from '../atoms/Panel';
import { Alignment, Row } from '../atoms/Row';
import { Size, Text } from '../atoms/Text';
import { Button, ButtonStyle } from '../atoms/Button';

const TotalsByMonth: FC<{ area?: string; hasCheckboxes?: boolean }> = ({
  area,
  hasCheckboxes = true,
}) => {
  const { format } = useCurrencyFormatter();
  const categories = [
    'Earning',
    'Earning Minus Saving',
    'Saving',
    'Spending',
    'Saving & Spending',
  ];
  const {
    onChange: onChangeVisibleCategories,
    selectedOptions: visibleCategories,
  } = useMultiselect({
    defaultValue: ['Net'],
    options: categories,
  });
  const { isLoading, totalsByMonth } = useTotalsByMonth();
  const totalsByMonthWithAvailable = totalsByMonth?.map((totals) => {
    const earning = totals[Series.Earning];
    if (!earning) return totals;
    const saving = totals[Series.Saving] ?? 0;
    const spending = totals[Series.Spending] ?? 0;
    const available = earning - saving;
    const net = earning - (saving + spending);
    return {
      ...totals,
      [Series.Available]: available,
      [Series.Net]: net,
    };
  });

  const visibleSeries = visibleCategories.map(
    (category) => SERIES_BY_CATEGORY[category],
  );

  const hasNegative = (totalsByMonthWithAvailable ?? []).some(
    (totals: Partial<Record<Series, number>>) =>
      visibleSeries.some((series) => (totals[series] ?? 0) < 0),
  );

  const seriesToAverage = [Series.Earning, Series.Saving, Series.Spending];

  const totalsBySeries = (totalsByMonthWithAvailable ?? []).reduce(
    (
      result: Partial<Record<Series, number>>,
      totals: Partial<Record<Series, number>>,
    ) => {
      const newResult = { ...result };
      seriesToAverage.forEach((series) => {
        const oldValue = result[series] ?? 0;
        const currentValue = totals[series] ?? 0;
        newResult[series] = oldValue + currentValue;
      });
      return newResult;
    },
    {},
  );

  if (isLoading)
    return (
      <Panel area={area}>
        <PanelItem hasBottomBorder>
          <Text size={Size.Medium}>Cash Flow</Text>
        </PanelItem>
        <PanelItem>
          <Row alignment={Alignment.Center}>
            <LoadingIndicator />
          </Row>
        </PanelItem>
      </Panel>
    );

  return (
    <Panel area={area}>
      <PanelItem hasBottomBorder>
        <Row>
          <Text size={Size.Medium}>Cash Flow</Text>
          <Button
            onClick={() => {
              if (visibleCategories.includes('Earning'))
                onChangeVisibleCategories(['Net']);
              else if (visibleCategories.includes('Net'))
                onChangeVisibleCategories(['Earning Minus Saving', 'Spending']);
              else onChangeVisibleCategories(['Earning', 'Saving', 'Spending']);
            }}
            style={ButtonStyle.Unstyled}
          >
            <Icon icon={IconType.Filter} />
          </Button>
        </Row>
      </PanelItem>
      <PanelItem hasBottomBorder>
        <Graph
          isEarningVisible={visibleCategories.includes('Earning')}
          isEarningMinusSavingVisible={visibleCategories.includes(
            'Earning Minus Saving',
          )}
          isNetVisible={visibleCategories.includes('Net')}
          isReferenceLineVisible={hasNegative}
          isSavingVisible={visibleCategories.includes('Saving')}
          isSavingAndSpendingVisible={visibleCategories.includes(
            'Saving & Spending',
          )}
          isSpendingVisible={visibleCategories.includes('Spending')}
          totalsByMonth={totalsByMonthWithAvailable}
        />
        {hasCheckboxes && (
          <Checkboxes
            label="Categories"
            onChange={onChangeVisibleCategories}
            options={categories}
            selectedOptions={visibleCategories}
          />
        )}
      </PanelItem>
      <PanelItem hasPadding={false}>
        <Row columnBreakpoint={610}>
          <AverageWrapper>
            <Text size={Size.Large}>
              {format(
                (totalsBySeries[Series.Earning] ?? 0) /
                  (totalsByMonth?.length ?? 1),
              )}
            </Text>
            <Text size={Size.Small}>Average Monthly Earning</Text>
          </AverageWrapper>
          <AverageWrapper>
            <Text size={Size.Large}>
              {format(
                (totalsBySeries[Series.Saving] ?? 0) /
                  (totalsByMonth?.length ?? 1),
              )}
            </Text>
            <Text size={Size.Small}>Average Monthly Saving</Text>
          </AverageWrapper>
          <AverageWrapper hasRightBorder={false}>
            <Text size={Size.Large}>
              {format(
                (totalsBySeries[Series.Spending] ?? 0) /
                  (totalsByMonth?.length ?? 1),
              )}
            </Text>
            <Text size={Size.Small}>Average Monthly Spending</Text>
          </AverageWrapper>
        </Row>
      </PanelItem>
    </Panel>
  );
};

const Graph: FC<{
  isEarningVisible?: boolean;
  isEarningMinusSavingVisible?: boolean;
  isNetVisible?: boolean;
  isReferenceLineVisible?: boolean;
  isSavingVisible?: boolean;
  isSavingAndSpendingVisible?: boolean;
  isSpendingVisible?: boolean;
  totalsByMonth?: MonthTotalsWithAvailable[];
}> = ({
  isEarningVisible = true,
  isEarningMinusSavingVisible = true,
  isNetVisible = true,
  isReferenceLineVisible = true,
  isSavingVisible = true,
  isSavingAndSpendingVisible = true,
  isSpendingVisible = true,
  totalsByMonth = [],
}) => {
  if (totalsByMonth.length === 0) {
    return (
      <ResponsiveContainer aspect={4} minWidth={250} width="100%">
        <LineChart />
      </ResponsiveContainer>
    );
  }
  const earliestMonth = totalsByMonth?.[0]?.month ?? '';
  const latestMonth = totalsByMonth?.[totalsByMonth.length - 1].month ?? '';
  const monthsToLabelBySeriesName = getMonthsToLabel(totalsByMonth);
  return (
    <>
      <div
        data-testid="totals-by-month-graph"
        {...totalsByMonth?.reduce(
          (dataTags, { earning, month, saving, spending }) => {
            const key = `data-month-${month.replace(' ', '-')}`.toLowerCase();
            return {
              ...dataTags,
              [key]: `earning-${earning}-saving-${saving}-spending-${spending}`,
            };
          },
          {},
        )}
      />
      <ResponsiveContainer aspect={4} minWidth={250} width="100%">
        <LineChart data={formatData({ totalsByMonth })}>
          {isNetVisible && (
            <Line dataKey="net" dot={false} stroke="purple">
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
                    entry.payload.month ===
                    monthsToLabelBySeriesName[Series.Net]
                  )
                    return entry.value;
                  return null;
                }}
              />
            </Line>
          )}
          {isEarningVisible && (
            <Line dataKey="earning" dot={false} stroke="green">
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
                    entry.payload.month ===
                    monthsToLabelBySeriesName[Series.Earning]
                  )
                    return entry.value;
                  return null;
                }}
              />
            </Line>
          )}
          {isEarningMinusSavingVisible && (
            <Line dataKey="available" dot={false} stroke="yellowgreen">
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
                    entry.payload.month ===
                    monthsToLabelBySeriesName[Series.Available]
                  )
                    return entry.value;
                  return null;
                }}
              />
            </Line>
          )}
          {isSavingVisible && (
            <Line dataKey="saving" dot={false} stroke="blue">
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
                    entry.payload.month ===
                    monthsToLabelBySeriesName[Series.Saving]
                  )
                    return entry.value;
                  return null;
                }}
              />
            </Line>
          )}
          {isSpendingVisible && (
            <Line dataKey="spending" dot={false} stroke="orange">
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
                    entry.payload.month ===
                    monthsToLabelBySeriesName[Series.Spending]
                  )
                    return entry.value;
                  return null;
                }}
              />
            </Line>
          )}
          {isSavingAndSpendingVisible && (
            <Line
              dataKey="savingAndSpending"
              dot={false}
              stroke="purple"
              strokeWidth={1}
            />
          )}
          {isReferenceLineVisible && (
            <ReferenceLine
              label={{
                fontSize: '0.8rem',
                value: 0,
              }}
              stroke="lightgrey"
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
                month: 'short',
                year: 'numeric',
              })
            }
            ticks={[earliestMonth, latestMonth]}
          />
          <Legend
            align="center"
            formatter={(value) => LEGEND_LABELS[value] ?? value}
            iconType="plainline"
            wrapperStyle={{ fontSize: '0.8rem' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

const formatData = ({
  totalsByMonth,
}: {
  totalsByMonth?: MonthTotals[];
}): { earning: number; month: string; saving: number; spending: number }[] => {
  if (!totalsByMonth) return [];
  const result = totalsByMonth.map(({ earning, month, saving, spending }) => ({
    earning: earning || 0,
    available: difference(earning, saving),
    month,
    net: difference(earning, sum(saving, spending)),
    saving: saving || 0,
    savingAndSpending: sum(saving, spending),
    spending: spending || 0,
  }));
  return result;
};

function sum(a: number | undefined, b: number | undefined): number {
  let total = 0;
  if (a) total += a;
  if (b) total += b;
  return total;
}

function difference(a: number | undefined, b: number | undefined): number {
  let total = 0;
  if (a) total += a;
  if (b) total -= b;
  return total;
}

function formatThousands(cents: number): string {
  const dollars = cents / 100;
  if (Math.abs(dollars) < 1000) return Math.round(dollars).toString();
  const hundreds = Math.round(dollars / 100);
  return `${hundreds / 10}k`;
}

function getMonthsToLabel(
  totals: MonthTotalsWithAvailable[] | undefined,
): Partial<Record<Series, string>> {
  if (!totals) return {};
  const monthsToLabel = totals?.reduce(
    (result, monthTotal) => {
      const newResult = { ...result };
      Object.values(Series).forEach((series) => {
        const seriesTotal = monthTotal[series];
        if (!seriesTotal) return;
        if (seriesTotal > result[series]?.maximum)
          newResult[series] = {
            maximum: seriesTotal,
            month: monthTotal.month,
          };
      });
      return newResult;
    },
    {
      available: { maximum: 0, month: '' },
      earning: { maximum: 0, month: '' },
      net: { maximum: 0, month: '' },
      saving: { maximum: 0, month: '' },
      spending: { maximum: 0, month: '' },
    },
  );
  return Object.entries(monthsToLabel).reduce(
    (result, [key, value]) => ({
      ...result,
      [key]: value.month,
    }),
    {},
  );
}

enum Series {
  Available = 'available',
  Earning = 'earning',
  Net = 'net',
  Saving = 'saving',
  Spending = 'spending',
}

interface MonthTotalsWithAvailable extends MonthTotals {
  available?: number;
  net?: number;
}

const LEGEND_LABELS: Record<string, string> = {
  [Series.Available]: 'Available (Earning - Saving)',
  [Series.Earning]: 'Earning',
  [Series.Net]: 'Net Cashflow',
  [Series.Saving]: 'Saving',
  [Series.Spending]: 'Spending',
};

const SERIES_BY_CATEGORY: Record<string, Series> = {
  Earning: Series.Earning,
  'Earning Minus Spending': Series.Available,
  Net: Series.Net,
  Saving: Series.Saving,
  Spending: Series.Spending,
};

const AverageWrapper = styled.div<{ hasRightBorder?: boolean }>`
  ${({ hasRightBorder = true }) =>
    hasRightBorder &&
    `
      border-bottom: solid lightgrey 1px;
      @media (min-width: 610px) {
        border-bottom: none;
        border-right: solid lightgrey 1px;
      }
    `}
  flex-grow: 1;
  padding: 8px 16px;
  width: 100%;
`;

export default TotalsByMonth;
