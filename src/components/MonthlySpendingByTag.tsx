import React, { FC, useState } from 'react';
import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import Checkbox from 'components/Checkbox';
import Checkboxes from 'components/Checkboxes';
import useAveragingPeriod from 'hooks/useAveragingPeriod';
import useMonth from 'hooks/useMonth';
import useMultiselect from 'hooks/useMultiselect';
import useTransactionsByTag from 'hooks/useTransactionsByTag';
import type { TagGroup } from 'types/tagGroup';
import MonthSelector from './organisms/MonthSelector';
import LoadingIndicator from './atoms/LoadingIndicator';

const MonthlySpendingByTag: FC = () => {
  const { endDate: endOfMonth, startDate: startOfMonth } = useMonth();
  const {
    count,
    endIso: endOfAveragingPeriod,
    startIso: startOfAveragingPeriod,
  } = useAveragingPeriod();
  const { spending: averageSpending, isLoading: isLoadingAverages } =
    useTransactionsByTag({
      endDate: endOfAveragingPeriod,
      startDate: startOfAveragingPeriod,
    });
  const { isLoading, spending } = useTransactionsByTag({
    endDate: endOfMonth,
    startDate: startOfMonth,
  });
  const [isAverageVisible, setIsAverageVisible] = useState<boolean>(false);
  const orderedTags = getOrderedTags({
    averageSpending,
    averagingCount: count,
    isAverageVisible,
    spending,
  });
  const {
    onChange,
    onDeselectAll,
    onSelectAll,
    selectedOptions: selectedTags,
  } = useMultiselect({
    options: orderedTags,
  });
  if (isLoading || isLoadingAverages) return <LoadingIndicator />;
  const spendingBarData = formatSpendingBarData({
    averageSpending,
    averagingCount: count,
    isAverageVisible,
    spending,
  });
  const coloursByTag: Record<string, string> = orderedTags.reduce(
    (result, tag, index) => ({
      ...result,
      [tag]: COLOURS[index % COLOURS.length],
    }),
    {},
  );
  const lastTag = orderedTags
    .slice()
    .reverse()
    .find((tag) => selectedTags.includes(tag));
  return (
    <>
      <h2>Monthly Spending by Tag</h2>
      <MonthSelector />
      <div
        data-testid="monthly-spending-by-tag-graph"
        {...getDataTags({ averageSpending, averagingCount: count, spending })}
      />
      <ResponsiveContainer
        aspect={isAverageVisible ? 3 : 5}
        height="max-content"
        minWidth={300}
        width="100%"
      >
        <BarChart data={spendingBarData} layout="vertical">
          <Tooltip />
          {orderedTags.map((tag) => {
            if (!selectedTags.includes(tag)) return <></>;
            const isLastTag = tag === lastTag;
            return (
              <Bar dataKey={tag} fill={coloursByTag[tag]} key={tag} stackId="a">
                <LabelList
                  formatter={(label: number) => {
                    const hundreds = Math.round(label / 10000);
                    const ones = Math.round(label / 100);
                    if (hundreds <= 10) return ones;
                    return `${hundreds / 10}k`;
                  }}
                  position={isLastTag ? 'right' : undefined}
                  valueAccessor={(entry: {
                    value: number[];
                    width: number;
                  }) => {
                    const total = entry.value[1];
                    const delta = entry.value[1] - entry.value[0];
                    if (isLastTag) return total;
                    if (entry.width > 40) return delta;
                    return null;
                  }}
                />
              </Bar>
            );
          })}
          <XAxis
            padding={{ right: 20 }}
            tickFormatter={(amount) => {
              if (amount < 100000) return `${amount / 100}`;
              return `${amount / 100000}k`;
            }}
            type="number"
          />
          <YAxis dataKey="label" hide type="category" />
        </BarChart>
      </ResponsiveContainer>
      <Checkbox
        isChecked={isAverageVisible}
        label="Show Average"
        onChange={(newIsAverageVisible) => {
          setIsAverageVisible(newIsAverageVisible);
        }}
      />
      <Checkboxes
        onChange={onChange}
        onSelectAll={onSelectAll}
        onDeselectAll={onDeselectAll}
        options={orderedTags}
        selectedOptions={selectedTags}
      />
    </>
  );
};

const getDataTags = ({
  averageSpending,
  averagingCount,
  spending,
}: {
  averageSpending?: TagGroup[];
  averagingCount: number;
  spending?: TagGroup[];
}): Record<string, string> => {
  const tags: Record<string, string> = {};
  averageSpending?.forEach(({ tag, totalAmount }: TagGroup) => {
    tags[`data-${formatTag(tag)}-average`] = (
      totalAmount / averagingCount
    ).toString();
  });
  spending?.forEach(({ tag, totalAmount }: TagGroup) => {
    tags[`data-${formatTag(tag)}`] = totalAmount.toString();
  });
  return tags;
};

const formatTag = (tag: string): string =>
  tag.replace(' ', '-').replace('(', '').replace(')', '').toLowerCase();

const formatSpendingBarData = ({
  averageSpending,
  averagingCount,
  isAverageVisible,
  spending,
}: {
  averageSpending?: TagGroup[];
  averagingCount: number;
  isAverageVisible: boolean;
  spending?: TagGroup[];
}) => {
  const spendingGroup = spending?.reduce(
    (group, { tag, totalAmount }) => ({ ...group, [tag]: totalAmount }),
    { label: 'current' },
  );
  if (!isAverageVisible) return [spendingGroup];
  const averageSpendingGroup = averageSpending?.reduce(
    (group, { tag, totalAmount }) => ({
      ...group,
      [tag]: totalAmount / averagingCount,
    }),
    { label: 'average' },
  );
  return [spendingGroup, averageSpendingGroup];
};

const getOrderedTags = ({
  averageSpending,
  averagingCount,
  isAverageVisible = false,
  spending,
}: {
  averageSpending?: TagGroup[];
  averagingCount: number;
  isAverageVisible?: boolean;
  spending?: TagGroup[];
}): string[] => {
  const amountByTag: Record<string, number> = {};
  spending?.forEach(({ tag, totalAmount }) => {
    amountByTag[tag] = totalAmount;
  });
  if (isAverageVisible) {
    averageSpending?.forEach(({ tag, totalAmount }) => {
      const currentAmount = amountByTag[tag] || 0;
      amountByTag[tag] = currentAmount + totalAmount / averagingCount;
    });
  }
  return Object.entries(amountByTag)
    .sort((first, second) => (first[1] > second[1] ? -1 : 1))
    .map(([firstTag]) => firstTag);
};

const COLOURS = [
  'lightblue',
  'pink',
  'yellow',
  'orange',
  'lightgreen',
  'purple',
];

export default MonthlySpendingByTag;
