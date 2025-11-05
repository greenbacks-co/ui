import useCurrencyFormatter from 'hooks/useCurrencyFormatter';
import React, { ReactElement } from 'react';
import { Pie, PieChart, ResponsiveContainer } from 'recharts';

export function CashflowGuage({
  data: {
    fixedEarning = 0,
    fixedSaving = 0,
    fixedSpending = 0,
    variableEarning = 0,
    variableSaving = 0,
    variableSpending = 0,
  } = {},
}: {
  data?: {
    fixedEarning?: number;
    fixedSaving?: number;
    fixedSpending?: number;
    variableEarning?: number;
    variableSaving?: number;
    variableSpending?: number;
  };
}): ReactElement {
  const { format } = useCurrencyFormatter();
  const totalInflow = fixedEarning + variableEarning;
  const totalSaving = fixedSaving + variableSaving;
  const totalOutflow = totalSaving + fixedSpending + variableSpending;
  const outflowRatio = totalOutflow / totalInflow;
  const outflowStartAngle = 90 - 90 * outflowRatio;
  return (
    <ResponsiveContainer
      aspect={1}
      height="max-content"
      minWidth={400}
      width="100%"
    >
      <PieChart>
        <Pie
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
          ]}
          dataKey="value"
          endAngle={90}
          isAnimationActive={false}
          innerRadius="40%"
          outerRadius="50%"
          startAngle={0}
        />
        <Pie
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
          innerRadius="50%"
          isAnimationActive={false}
          label={CustomLabel}
          labelLine={false}
          outerRadius="60%"
          startAngle={outflowStartAngle}
        />
      </PieChart>
    </ResponsiveContainer>
  );
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
  const radius = outerRadius * 1.15;
  const angle = labelPosition === 'upper' ? endAngle : startAngle;
  return (
    <text
      fill="black"
      x={cx + radius * Math.cos(-angle * RADIAN)}
      y={cy + radius * Math.sin(-angle * RADIAN)}
    >
      {label}
    </text>
  );
}

const RADIAN = Math.PI / 180;
