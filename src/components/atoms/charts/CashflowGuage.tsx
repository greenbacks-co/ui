import useCurrencyFormatter from 'hooks/useCurrencyFormatter';
import React, { ReactElement } from 'react';
import { Pie, PieChart, ResponsiveContainer } from 'recharts';

const RADIAN = Math.PI / 180;

export function CashflowGuage({
  fixedEarning = 0,
  fixedSaving = 0,
  fixedSpending = 0,
  projectedFixedEarning = 0,
  variableEarning = 0,
  variableSaving = 0,
  variableSpending = 0,
}: {
  fixedEarning?: number;
  fixedSaving?: number;
  fixedSpending?: number;
  projectedFixedEarning?: number;
  variableEarning?: number;
  variableSaving?: number;
  variableSpending?: number;
}): ReactElement {
  const { format } = useCurrencyFormatter({ shorten: true });
  const remainingProjectedFixedEarning = Math.max(
    projectedFixedEarning - fixedEarning,
    0,
  );
  const totalInflow =
    remainingProjectedFixedEarning + fixedEarning + variableEarning;
  const totalSaving = fixedSaving + variableSaving;
  const totalOutflow = totalSaving + fixedSpending + variableSpending;
  const outflowRatio = totalOutflow / totalInflow;
  const outflowStartAngle = 90 - 90 * outflowRatio;
  const { cx, cy, innerRadius, middleRadius, outerRadius } = getPosition({
    outflowRatio,
  });
  return (
    <ResponsiveContainer
      aspect={1.4}
      height="max-content"
      minWidth={250}
      width="100%"
    >
      <PieChart>
        <defs>
          <pattern
            id="fixed-spending-stripe"
            width="3"
            height="3"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <rect width="2" height="4" fill="darkgreen" />
          </pattern>
        </defs>
        <Pie
          cx={cx}
          cy={cy}
          data={[
            {
              fill: 'lightgreen',
              name: 'Variable Earning',
              value: variableEarning,
            },
            {
              fill: 'darkgreen',
              name: 'Fixed Earning',
              value: fixedEarning,
            },
            {
              fill: 'url(#fixed-spending-stripe)',
              name: 'Projected Fixed Earning',
              value: remainingProjectedFixedEarning,
            },
          ]}
          dataKey="value"
          endAngle={90}
          innerRadius={innerRadius}
          isAnimationActive={false}
          outerRadius={middleRadius}
          startAngle={0}
        />
        <Pie
          cx={cx}
          cy={cy}
          data={[
            {
              fill: 'orange',
              label: format(totalInflow - totalOutflow),
              labelPosition: 'lower',
              name: 'Variable Spending',
              value: variableSpending,
            },
            {
              fill: 'darkorange',
              label: format(totalInflow - totalSaving - fixedSpending),
              labelPosition: 'lower',
              name: 'Fixed Spending',
              value: fixedSpending,
            },
            {
              fill: 'lightblue',
              label: format(totalInflow - totalSaving),
              labelPosition: 'lower',
              name: 'Variable Saving',
              value: variableSaving,
            },
            {
              fill: 'darkblue',
              label: format(totalInflow),
              labelPosition: 'upper',
              name: 'Fixed Saving',
              value: fixedSaving,
            },
          ]}
          dataKey="value"
          endAngle={90}
          innerRadius={middleRadius}
          isAnimationActive={false}
          label={CustomLabel}
          labelLine={false}
          outerRadius={outerRadius}
          startAngle={outflowStartAngle}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

function getPosition({ outflowRatio }: { outflowRatio: number }): {
  cx: string;
  cy: string;
  innerRadius: string;
  middleRadius: string;
  outerRadius: string;
} {
  const yOverflow = Math.min(Math.max(outflowRatio, 1), 2) - 1;
  const xOverflow = Math.min(Math.max(outflowRatio, 2), 3) - 2;
  const cx = 30 + xOverflow * 20;
  const cy = 80 - yOverflow * 30;
  const radius = 90 - yOverflow * 30;
  return {
    cx: `${cx}%`,
    cy: `${cy}%`,
    innerRadius: `${radius - 20}%`,
    middleRadius: `${radius}%`,
    outerRadius: `${radius + 20}%`,
  };
}

function CustomLabel({
  cx,
  cy,
  endAngle,
  outerRadius,
  payload: { label, labelPosition },
  startAngle,
}: {
  cx: number;
  cy: number;
  endAngle: number;
  outerRadius: number;
  payload: { label?: number; labelPosition?: string };
  startAngle: number;
}): ReactElement | undefined {
  if (!label || !labelPosition) return undefined;
  const radius = outerRadius * 1.1;
  const angle = labelPosition === 'upper' ? endAngle : startAngle;
  return (
    <text
      fill="black"
      style={{ fontSize: '0.6rem' }}
      x={cx + radius * Math.cos(-angle * RADIAN)}
      y={cy + radius * Math.sin(-angle * RADIAN)}
    >
      {label}
    </text>
  );
}
