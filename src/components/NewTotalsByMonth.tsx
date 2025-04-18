import { DateTime } from 'luxon';
import React, { ReactElement } from 'react';
import {
  Legend,
  // LabelList,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
} from 'recharts';

// import { formatThousands } from 'utils/formatThousands';

export function TotalsByMonth({
  coloursBySeries = {},
  monthTotals = [],
  visibilityBySeries = {},
}: {
  coloursBySeries?: Partial<Record<Series, string>>;
  monthTotals?: Month[];
  visibilityBySeries?: Partial<Record<Series, boolean>>;
}): ReactElement {
  const earliestMonth = monthTotals[0]?.month ?? '';
  const latestMonth = monthTotals[monthTotals.length - 1]?.month ?? '';
  const hasNegative = monthTotals.some((monthTotal) =>
    Object.values(Series).some((series) => {
      if (!visibilityBySeries[series]) return false;
      return (monthTotal[series] ?? 0) < 0;
    }),
  );
  return (
    <ResponsiveContainer aspect={3.6} minWidth={400} width="100%">
      <LineChart data={[...monthTotals].reverse()}>
        {Object.values(Series).map(
          (series) =>
            visibilityBySeries[series] && (
              <Line
                dataKey={series}
                dot={false}
                key={series}
                stroke={coloursBySeries[series]}
              >
                {/* <LabelList formatter={formatThousands} /> */}
              </Line>
            ),
        )}
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
        <Legend iconType="plainline" wrapperStyle={{ fontSize: '0.8rem' }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export interface Month extends Partial<Record<Series, number>> {
  month: string;
}

export enum Series {
  AfterFixedSpending = 'afterFixedSpending',
  AfterSaving = 'afterSaving',
  AfterVariableSpending = 'afterVariableSpending',
  Available = 'available',
  Earning = 'earning',
  FixedSpending = 'fixedSpending',
  Net = 'net',
  Saving = 'saving',
  Spending = 'spending',
  VariableSpending = 'variableSpending',
}
