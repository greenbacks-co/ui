import React, { FC } from 'react';
import { Pie, PieChart, ResponsiveContainer } from 'recharts';

const CashFlowGraph: FC<{
  earning?: number;
  idPrefix?: string;
  isLoading?: boolean;
  saving?: number;
  spending?: number;
}> = ({ earning, idPrefix, isLoading = false, saving, spending }) => {
  if (isLoading) return null;

  const testId = idPrefix ? `${idPrefix}-cash-flow-graph` : 'cash-flow-graph';

  return (
    <>
      <div
        data-earning={Math.round(earning || 0)}
        data-saving={Math.round(saving || 0)}
        data-spending={Math.round(spending || 0)}
        data-testid={testId}
      />
      <ResponsiveContainer aspect={1.5} minWidth={300} width="100%">
        <PieChart>
          <Pie
            cx="50%"
            cy="50%"
            data={formatData({
              earning,
              saving,
              spending,
            })}
            dataKey="amount"
            fill="#8884d8"
            label={({ name }) => name}
            nameKey="name"
            outerRadius={80}
          />
        </PieChart>
      </ResponsiveContainer>
    </>
  );
};

const formatData = ({
  earning,
  saving,
  spending,
}: {
  earning?: number;
  saving?: number;
  spending?: number;
}): { amount: number; name: string }[] => {
  if (!earning || !saving || !spending) return [];
  const result = [
    { amount: earning, fill: 'green', name: 'Earning' },
    { amount: spending, fill: 'orange', name: 'Spending' },
    { amount: saving, fill: 'blue', name: 'Saving' },
  ];
  return result;
};

export default CashFlowGraph;
