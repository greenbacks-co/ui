import { DateTime } from 'luxon';
import React from 'react';
import {
  LabelList,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
} from 'recharts';

export function MonthlyAmountsGraph({
  endDate,
  hasAverageLines = true,
  hasLegend = true,
  monthlyAmountsBySeriesName = {},
  monthCount,
  seriesConfigurationByName = {},
  startDate,
}: {
  endDate?: DateTime;
  hasAverageLines?: boolean;
  hasLegend?: boolean;
  monthCount?: number;
  monthlyAmountsBySeriesName?: Record<string, MonthlyAmount[]>;
  seriesConfigurationByName?: Record<string, SeriesConfiguration>;
  startDate?: DateTime;
} = {}): React.ReactElement {
  if (Object.keys(monthlyAmountsBySeriesName).length === 0) return <></>;
  if (
    Object.values(monthlyAmountsBySeriesName).every(
      (series) => series.length === 0,
    )
  )
    return <></>;
  const monthToLabel = getMonthToLabel(monthlyAmountsBySeriesName);
  const {
    earliestMonth,
    latestMonth,
    monthCount: fullRangeMonthCount,
  } = getMonthRange({
    endDate,
    monthlyAmountsBySeriesName,
    startDate,
  });
  const seriesNames = Object.keys(monthlyAmountsBySeriesName);
  const averagesBySeriesName = seriesNames.reduce<Record<string, number>>(
    (result, name) => {
      const monthlyAmounts = monthlyAmountsBySeriesName[name] ?? [];
      const sum = monthlyAmounts.reduce(
        (total, { amount }) => total + amount,
        0,
      );
      const average = sum / (monthCount ?? fullRangeMonthCount);
      return {
        ...result,
        [name]: average,
      };
    },
    {},
  );
  const emptyAmounts = seriesNames.reduce(
    (result, name) => ({ ...result, [name]: 0 }),
    {},
  );
  const amountsByMonth: Record<string, Record<string, number>> = {};
  for (
    let month = earliestMonth;
    month <= latestMonth;
    month = month.plus({ months: 1 })
  ) {
    amountsByMonth[month.toFormat('yyyy-LL')] = { ...emptyAmounts };
  }
  seriesNames.forEach((name) => {
    const data = monthlyAmountsBySeriesName[name];
    data.forEach((monthAmount) => {
      const serializedMonth = monthAmount.month.toFormat('yyyy-LL');
      amountsByMonth[serializedMonth][name] = monthAmount.amount;
    });
  });
  const graphableData = Object.entries(amountsByMonth).map(
    ([serializedMonth, amountsBySeriesName]) => ({
      ...amountsBySeriesName,
      month: serializedMonth,
    }),
  );
  return (
    <ResponsiveContainer
      aspect={2}
      height="max-content"
      minWidth={250}
      width="100%"
    >
      <LineChart data={graphableData}>
        {seriesNames.map((name) => {
          const { colour } = seriesConfigurationByName[name] ?? {};
          return (
            <Line
              dataKey={name}
              dot={false}
              isAnimationActive={false}
              key={name}
              stroke={colour}
            >
              <LabelList
                formatter={formatThousands}
                style={{
                  fontSize: '0.8rem',
                }}
                valueAccessor={(entry: {
                  payload: { month: string };
                  value: number;
                }) => {
                  if (entry.payload.month === monthToLabel) return entry.value;
                  return null;
                }}
              />
            </Line>
          );
        })}
        {hasAverageLines &&
          seriesNames.map((name) => {
            const { colour = 'lightgrey' } =
              seriesConfigurationByName[name] ?? {};
            return (
              <ReferenceLine
                key={name}
                label={{
                  fontSize: '0.8rem',
                  value: formatThousands(averagesBySeriesName[name]),
                }}
                stroke={colour}
                y={averagesBySeriesName[name]}
              />
            );
          })}
        <XAxis
          dataKey="month"
          interval="preserveStartEnd"
          tick={{ fontSize: '0.8rem' }}
          tickFormatter={(value) =>
            DateTime.fromISO(value).toLocaleString({
              month: 'short',
              year: 'numeric',
            })
          }
          ticks={[
            earliestMonth.toFormat('yyyy-LL'),
            latestMonth.toFormat('yyyy-LL'),
          ]}
        />
        {hasLegend && (
          <Legend
            align="center"
            iconType="plainline"
            wrapperStyle={{ fontSize: '0.8rem' }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}

interface SeriesConfiguration {
  colour: string;
}

interface MonthlyAmount {
  amount: number;
  month: DateTime;
}

function formatThousands(cents: number): string {
  const dollars = cents / 100;
  if (dollars < 1000) return Math.round(dollars).toString();
  const hundreds = Math.round(dollars / 100);
  return `${hundreds / 10}k`;
}

function getMonthRange({
  endDate,
  monthlyAmountsBySeriesName,
  startDate,
}: {
  endDate?: DateTime;
  monthlyAmountsBySeriesName: Record<string, MonthlyAmount[]>;
  startDate?: DateTime;
}): { earliestMonth: DateTime; latestMonth: DateTime; monthCount: number } {
  const series = Object.values(monthlyAmountsBySeriesName);
  let earliestMonth = series[0][0].month;
  let latestMonth = earliestMonth;
  series.forEach((monthlyAmounts) => {
    monthlyAmounts.forEach((monthlyAmount) => {
      if (monthlyAmount.month < earliestMonth)
        earliestMonth = monthlyAmount.month;
      if (monthlyAmount.month > latestMonth) latestMonth = monthlyAmount.month;
    });
  });
  const startDateOrDefault = startDate ?? earliestMonth;
  const endDateOrDefault = endDate ?? latestMonth;
  return {
    earliestMonth: startDateOrDefault,
    latestMonth: endDateOrDefault,
    monthCount: Math.round(
      endDateOrDefault.diff(startDateOrDefault, 'months').months,
    ),
  };
}

function getMonthToLabel(
  amountsByName: Record<string, MonthlyAmount[]>,
): string {
  const monthAmounts = Object.values(amountsByName);
  let { amount: max, month } = monthAmounts[0][0];
  monthAmounts.forEach((amountsByMonth) => {
    amountsByMonth.forEach(({ amount, month: monthToCheck }) => {
      if (amount >= max) {
        max = amount;
        month = monthToCheck;
      }
    });
  });
  return month.toFormat('yyyy-LL');
}
