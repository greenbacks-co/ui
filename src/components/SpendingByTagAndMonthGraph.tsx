import React, { FC } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

import useAveragingPeriod from 'hooks/useAveragingPeriod';
import useNow from 'hooks/useNow';
import useTagsByCategory from 'hooks/useTagsByCategory';
import useTransactionsByTagAndMonth, {
  MonthTagGroup,
} from 'hooks/useTransactionsByTagAndMonth';
import getMonth from 'utils/getMonth';
import LoadingIndicator from './atoms/LoadingIndicator';

const SpendingByTagAndMonthGraph: FC<{ selectedTags?: string[] }> = ({
  selectedTags,
}) => {
  const { now } = useNow();
  const { lastDay } = getMonth({ datetime: now });
  const { startIso: startOfAveragingPeriod } = useAveragingPeriod();
  const { isLoading: isLoadingSpending, spending } =
    useTransactionsByTagAndMonth({
      endDate: lastDay,
      startDate: startOfAveragingPeriod,
    });
  const { isLoading: isLoadingTags, spending: tags } = useTagsByCategory();

  if (isLoadingSpending || isLoadingTags)
    return <LoadingIndicator name="monthly-spending-by-tag-graph" />;

  const graphData = formatData({ selectedTags, spending });

  return (
    <>
      <div
        data-testid="monthly-spending-by-tag-graph"
        {...getDataTags({ spending, selectedTags })}
      />
      <ResponsiveContainer aspect={1.5} minWidth={300} width="100%">
        <BarChart barGap={0} data={graphData}>
          <CartesianGrid strokeDasharray="2 4" vertical={false} />
          {tags?.map((tag) => (
            <Bar dataKey={tag} fill="orange" key={tag} stackId="a" />
          ))}
          <XAxis dataKey="month" interval="preserveStartEnd" reversed />
          <YAxis
            axisLine={false}
            tickFormatter={(amount) => {
              if (amount < 100000) return `${amount / 100}`;
              return `${amount / 100000}k`;
            }}
            tickLine={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

const formatData = ({
  selectedTags,
  spending,
}: {
  selectedTags?: string[];
  spending?: MonthTagGroup[];
}): Record<string, string | number>[] => {
  if (
    spending === undefined ||
    selectedTags === undefined ||
    selectedTags.length === 0
  )
    return [];
  return spending.map(({ month, tags }) => {
    const amountsByTag = tags
      .filter(({ tag }) => selectedTags.includes(tag))
      .reduce(
        (result, { tag, totalAmount }) => ({
          ...result,
          [tag]: totalAmount,
        }),
        {},
      );
    return { month, ...amountsByTag };
  });
};

const getDataTags = ({
  selectedTags,
  spending,
}: {
  selectedTags?: string[];
  spending?: MonthTagGroup[];
}): Record<string, string | number> => {
  if (
    spending === undefined ||
    selectedTags === undefined ||
    selectedTags.length === 0
  )
    return {};
  const dataTags = spending?.reduce((existingTags, { month, tags }) => {
    const newTags = tags
      .filter(({ tag }) => selectedTags?.includes(tag))
      .reduce(
        (result, { tag, totalAmount }) => ({
          ...result,
          [`data-${month}-${formatTagForDataTag(tag)}`]: totalAmount,
        }),
        {},
      );
    return {
      ...existingTags,
      ...newTags,
    };
  }, {});
  return dataTags;
};

const formatTagForDataTag = (tag: string): string =>
  tag.replace(' ', '-').replace('(', '').replace(')', '').toLowerCase();

export default SpendingByTagAndMonthGraph;
