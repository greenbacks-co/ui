import React, { FC } from 'react';
import { Pie, PieChart, ResponsiveContainer } from 'recharts';

import SectionContainer from 'components/SectionContainer';
import useCurrencyFormatter from 'hooks/useCurrencyFormatter';
import type { TagGroup } from 'types/tagGroup';
import LoadingIndicator from '../atoms/LoadingIndicator';

const TransactionsByTag: FC<{
  id?: string;
  isGraphVisible?: boolean;
  isLoading: boolean;
  months?: number;
  name?: string;
  transactions: TagGroup[];
}> = ({
  id = 'transactions-by-tag',
  isGraphVisible = false,
  isLoading,
  months = 1,
  name = 'Transactions by Tag',
  transactions,
}) => {
  const { format } = useCurrencyFormatter();

  if (isLoading)
    return (
      <SectionContainer id={id} title={name}>
        <LoadingIndicator name={id} />
      </SectionContainer>
    );

  return (
    <SectionContainer id={id} title={name}>
      {isGraphVisible && (
        <Graph id={id} months={months} transactions={transactions} />
      )}
      <ul>
        {transactions.map(({ tag, totalAmount }) => {
          const formattedAmount = format({ value: totalAmount / months });
          return <li key={tag}>{`${tag}: ${formattedAmount}`}</li>;
        })}
      </ul>
    </SectionContainer>
  );
};

const Graph: FC<{ id: string; months: number; transactions: TagGroup[] }> = ({
  id,
  months,
  transactions,
}) => {
  const groupedTags = groupSmallTags({ transactions });
  return (
    <>
      <div
        data-testid={`${id}-graph`}
        {...transactions.reduce((dataTags, { tag, totalAmount }) => {
          const key = `data-tag-${tag.replaceAll(' ', '-')}`.toLowerCase();
          return {
            ...dataTags,
            [key]: totalAmount / months,
          };
        }, {})}
      />
      <ResponsiveContainer aspect={1.5} minWidth={300} width="100%">
        <PieChart>
          <Pie
            cx="50%"
            cy="50%"
            data={formatData({ transactions: groupedTags })}
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

const groupSmallTags = ({
  transactions,
}: {
  transactions: TagGroup[];
}): TagGroup[] => {
  const total = transactions?.reduce(
    (sum, { totalAmount }) => sum + totalAmount,
    0,
  );
  const largeTags: TagGroup[] = [];
  const smallTags: TagGroup[] = [];
  transactions.forEach((tagGroup) => {
    const { totalAmount: groupTotal } = tagGroup;
    if (groupTotal / total > 0.02) largeTags.push(tagGroup);
    else smallTags.push(tagGroup);
  });
  const tags = [...largeTags];
  if (smallTags.length > 0) {
    tags.push(
      smallTags.reduce(
        (
          {
            totalAmount: consolidatedTotal,
            transactions: consolidatedTransactions,
          },
          { totalAmount: tagTotal, transactions: tagTransactions },
        ) => ({
          tag: 'Small Tags',
          totalAmount: consolidatedTotal + tagTotal,
          transactions: [...consolidatedTransactions, ...tagTransactions],
        }),
      ),
    );
  }
  return tags;
};

const formatData = ({
  transactions,
}: {
  transactions: TagGroup[];
}): { amount: number; name: string }[] =>
  transactions.map(({ tag, totalAmount }) => ({
    amount: totalAmount,
    fill: 'orange',
    name: tag,
  }));

export default TransactionsByTag;
