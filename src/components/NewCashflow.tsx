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

import { formatThousands } from 'utils/formatThousands';
import noop from 'utils/noop';

export function Cashflow({
  coloursBySeries = COLOURS_BY_SERIES,
  formatAxisLabel = noop,
  hasLabels = false,
  isWide = false,
  labelsBySeries = LABELS_BY_SERIES,
  totals = [],
}: {
  coloursBySeries?: Partial<Record<Series, string>>;
  formatAxisLabel?: (input: string) => string | void;
  hasLabels?: boolean;
  isWide?: boolean;
  labelsBySeries?: Partial<Record<Series, string>>;
  totals?: Totals[];
}): ReactElement {
  const aspect = isWide ? 3.2 : 2;
  const hasNegative = totals.some(
    (group) => (group[Series.AfterVariableSpending] ?? 0) < 0,
  );
  return (
    <ResponsiveContainer
      aspect={aspect}
      height="max-content"
      minWidth={250}
      width="100%"
    >
      <ComposedChart data={totals}>
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
          dataKey={Series.Earning}
          dot={false}
          stroke={coloursBySeries[Series.Earning]}
          strokeWidth={2}
        >
          {hasLabels && (
            <LabelList
              formatter={formatThousands}
              position="top"
              style={{
                fontSize: LABEL_SIZE,
              }}
            />
          )}
        </Line>
        <Line
          dataKey={Series.AfterFixedSpending}
          dot={false}
          stroke={coloursBySeries[Series.AfterFixedSpending]}
          strokeWidth={2}
        >
          {hasLabels && (
            <LabelList
              formatter={formatThousands}
              style={{
                fontSize: LABEL_SIZE,
              }}
            />
          )}
        </Line>
        <Line
          dataKey={Series.AfterVariableSpending}
          dot={false}
          stroke={coloursBySeries[Series.AfterVariableSpending]}
          strokeWidth={2}
        >
          {hasLabels && (
            <LabelList
              formatter={formatThousands}
              position="bottom"
              style={{
                fontSize: LABEL_SIZE,
              }}
            />
          )}
        </Line>
        {hasNegative && (
          <ReferenceLine stroke="grey" strokeDasharray="5 3" y={0} />
        )}
        <XAxis
          dataKey="key"
          tickFormatter={(value) => formatAxisLabel(value) ?? value}
          interval="preserveStartEnd"
          tick={{ fontSize: '0.8rem' }}
          ticks={[totals[0]?.key, totals[totals.length - 1]?.key]}
        />
        <Legend
          formatter={(value: Series) => labelsBySeries[value] ?? value}
          iconType="plainline"
          wrapperStyle={{ fontSize: '0.8rem' }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export interface Totals {
  afterFixedSpending?: number;
  afterVariableSpending?: number;
  earning?: number;
  fixedSpending?: [number, number];
  key: string;
  saving?: [number, number];
  variableSpending?: [number, number];
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

export const COLOURS_BY_SERIES: Partial<Record<Series, string>> = {
  [Series.AfterFixedSpending]: 'darkorange',
  [Series.AfterSaving]: 'lightgreen',
  [Series.AfterVariableSpending]: 'purple',
  [Series.Earning]: 'darkgreen',
  [Series.FixedSpending]: 'orange',
  [Series.Saving]: 'lightblue',
  [Series.Spending]: 'red',
  [Series.VariableSpending]: 'gold',
};

export const LABELS_BY_SERIES: Partial<Record<Series, string>> = {
  [Series.AfterFixedSpending]: 'Disposable Income',
  [Series.AfterSaving]: 'Balance After Saving',
  [Series.AfterVariableSpending]: 'Total Cashflow',
  [Series.Earning]: 'Earning',
  [Series.FixedSpending]: 'Bills',
  [Series.Saving]: 'Saving',
  [Series.Spending]: 'Spending',
  [Series.VariableSpending]: 'Fun',
};

const LABEL_SIZE = '0.6rem';
