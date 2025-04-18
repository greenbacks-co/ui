import { DateTime } from 'luxon';
import React, { ReactElement, useState } from 'react';
import {
  Area,
  Bar,
  ComposedChart,
  LabelList,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
} from 'recharts';

import { formatThousands } from 'utils/formatThousands';

export function TotalsByMonth({
  coloursBySeries = {},
  monthTotals = [],
  labelsBySeries = {},
  visibilityBySeries = {},
}: {
  coloursBySeries?: Partial<Record<Series, string>>;
  monthTotals?: Month[];
  labelsBySeries?: Partial<Record<Series, string>>;
  visibilityBySeries?: Partial<Record<Series, boolean>>;
}): ReactElement {
  const [isLineVersion, setIsLineVersion] = useState(false);
  const shouldLabelAll = true;
  const earliestMonth = monthTotals[0]?.month ?? '';
  const latestMonth = monthTotals[monthTotals.length - 1]?.month ?? '';
  if (false) console.log({ visibilityBySeries });
  /*
  const hasNegative = monthTotals.some((monthTotal) =>
    Object.values(Series).some((series) => {
      if (!visibilityBySeries[series]) return false;
      return (monthTotal[series] ?? 0) < 0;
    }),
  );
  */
  const monthsToLabelBySeries = getMonthsToLabel(monthTotals);
  return (
    <>
      <button
        onClick={() => {
          setIsLineVersion(!isLineVersion);
        }}
        type="button"
      >
        toggle
      </button>
      <ResponsiveContainer aspect={3.2} minWidth={400} width="100%">
        {isLineVersion ? (
          <ComposedChart data={[...monthTotals].reverse()}>
            <Line
              dataKey={Series.Earning}
              dot={false}
              stroke={coloursBySeries[Series.Earning]}
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
                      entry.payload.month ===
                      monthsToLabelBySeries[Series.Earning]
                    )
                      return entry.value;
                    return null;
                  }}
                />
              )}
            </Line>
            <Bar
              dataKey={Series.AfterVariableSpending}
              fill="white"
              stackId="a"
            />
            <Bar
              dataKey={Series.VariableSpending}
              fill={coloursBySeries[Series.VariableSpending]}
              stackId="a"
            />
            <Bar
              dataKey={Series.FixedSpending}
              fill={coloursBySeries[Series.FixedSpending]}
              stackId="a"
            />
            <Bar
              dataKey={Series.Saving}
              fill={coloursBySeries[Series.Saving]}
              stackId="a"
            />
            <ReferenceLine
              label={{
                fontSize: '0.8rem',
                value: 0,
              }}
              stroke="grey"
              y={0}
            />
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
              formatter={(value: Series) => labelsBySeries[value] ?? value}
              iconType="plainline"
              wrapperStyle={{ fontSize: '0.8rem' }}
            />
          </ComposedChart>
        ) : (
          <ComposedChart
            data={[...formatDataForAreaChart(monthTotals)].reverse()}
          >
            <Line
              dataKey={Series.Earning}
              dot={false}
              stroke={coloursBySeries[Series.Earning]}
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
                      entry.payload.month ===
                      monthsToLabelBySeries[Series.Earning]
                    )
                      return entry.value;
                    return null;
                  }}
                />
              )}
            </Line>
            <Area
              dataKey={Series.Saving}
              fill={coloursBySeries[Series.Saving]}
              stroke="none"
            />
            <Area
              dataKey={Series.FixedSpending}
              fill={coloursBySeries[Series.FixedSpending]}
              stroke="none"
            />
            <Area
              dataKey={Series.VariableSpending}
              fill={coloursBySeries[Series.VariableSpending]}
              stroke="none"
            />
            <ReferenceLine
              label={{
                fontSize: '0.8rem',
                value: 0,
              }}
              stroke="grey"
              y={0}
            />
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
              formatter={(value: Series) => labelsBySeries[value] ?? value}
              iconType="plainline"
              wrapperStyle={{ fontSize: '0.8rem' }}
            />
          </ComposedChart>
        )}
      </ResponsiveContainer>
    </>
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

export enum Series {
  AfterFixedSpending = 'afterFixedSpending',
  AfterSaving = 'afterSaving',
  AfterVariableSpending = 'afterVariableSpending',
  Earning = 'earning',
  FixedSpending = 'fixedSpending',
  Saving = 'saving',
  Spending = 'spending',
  VariableSpending = 'variableSpending',
}

export const SERIES_ORDER = [
  Series.Earning,
  Series.Saving,
  Series.Spending,
  Series.FixedSpending,
  Series.VariableSpending,
  Series.AfterSaving,
  Series.AfterFixedSpending,
  Series.AfterVariableSpending,
];
