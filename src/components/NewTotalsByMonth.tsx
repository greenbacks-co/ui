import { DateTime } from 'luxon';
import React, { ReactElement } from 'react';
import {
  LabelList,
  Legend,
  Line,
  LineChart,
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
  const shouldLabelAll = true;
  const earliestMonth = monthTotals[0]?.month ?? '';
  const latestMonth = monthTotals[monthTotals.length - 1]?.month ?? '';
  const hasNegative = monthTotals.some((monthTotal) =>
    Object.values(Series).some((series) => {
      if (!visibilityBySeries[series]) return false;
      return (monthTotal[series] ?? 0) < 0;
    }),
  );
  const monthsToLabelBySeries = getMonthsToLabel(monthTotals);
  return (
    <ResponsiveContainer aspect={3.2} minWidth={400} width="100%">
      <LineChart data={[...monthTotals].reverse()}>
        {hasNegative && (
          <ReferenceLine
            label={{
              fontSize: '0.8rem',
              value: 0,
            }}
            stroke="lightgrey"
            y={0}
          />
        )}
        {Object.values(SERIES_ORDER).map(
          (series) =>
            visibilityBySeries[series] && (
              <Line
                dataKey={series}
                dot={false}
                key={series}
                stroke={coloursBySeries[series]}
              >
                {shouldLabelAll ? (
                  <LabelList
                    formatter={formatThousands}
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
                      if (entry.payload.month === monthsToLabelBySeries[series])
                        return entry.value;
                      return null;
                    }}
                  />
                )}
              </Line>
            ),
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
          formatter={(value: Series) => labelsBySeries[value] ?? value}
          iconType="plainline"
          wrapperStyle={{ fontSize: '0.8rem' }}
        />
      </LineChart>
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
