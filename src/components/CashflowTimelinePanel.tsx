import React, { ReactElement } from 'react';

import useCurrencyFormatter from 'hooks/useCurrencyFormatter';
import useMonth from 'hooks/useMonth';
import useTransactionsByCategory from 'hooks/useTransactionsByCategory';
import { Variability } from 'types/variability';
import groupTransactions, {
  GroupBy,
  SortGroupsBy,
} from 'utils/groupTransactions';
import { buildTimeline, CashflowTimeline } from './CashflowTimeline';
import { LABELS_BY_SERIES, Series, Totals } from './NewCashflow';
import { Panel, PanelItem } from './Panel';
import { Text } from './Text';
import List, { ExpanderContainer as Expander, Item } from './List';
import { JustifiedRow } from './JustifiedRow';

export function CashflowTimelinePanel({
  labelsBySeries = LABELS_BY_SERIES,
  tagAmountsBySeries = {},
  totals = [],
  totalsBySeries = {},
}: {
  labelsBySeries?: Partial<Record<Series, string>>;
  tagAmountsBySeries?: Partial<
    Record<Series, Array<{ amount: number; tag: string }>>
  >;
  totals?: Totals[];
  totalsBySeries?: Partial<Record<Series, number>>;
}): ReactElement {
  const { format } = useCurrencyFormatter();
  const seriesList = [
    Series.Earning,
    Series.Saving,
    Series.FixedSpending,
    Series.AfterFixedSpending,
    Series.VariableSpending,
    Series.AfterVariableSpending,
  ];
  return (
    <Panel>
      <PanelItem hasBottomBorder>
        <Text>Cashflow Timeline</Text>
      </PanelItem>
      <PanelItem hasBottomBorder>
        <CashflowTimeline totals={totals} />
      </PanelItem>
      <List
        hasOutsideBorder={false}
        hasRoundedBottomCorners
        hasRoundedTopCorners={false}
      >
        {seriesList.map((series, index) => {
          const isLastItem = index === seriesList.length - 1;
          const tagAmounts = tagAmountsBySeries[series] ?? [];
          return (
            <Expander
              heading={
                <JustifiedRow>
                  <Text>{format(totalsBySeries[series] ?? 0)}</Text>
                  <Text>{labelsBySeries[series]}</Text>
                </JustifiedRow>
              }
              body={
                <List
                  hasOutsideBorder={false}
                  hasRoundedBottomCorners={isLastItem}
                  hasRoundedTopCorners={false}
                  isInset
                >
                  {tagAmounts.map(({ amount, tag }) => (
                    <Item>
                      <JustifiedRow>
                        <Text>{tag}</Text>
                        <Text>{format(amount)}</Text>
                      </JustifiedRow>
                    </Item>
                  ))}
                </List>
              }
            />
          );
        })}
      </List>
    </Panel>
  );
}

export function CashflowTimelinePanelContainer(): ReactElement {
  const { endDate, startDate } = useMonth();
  const {
    earning = [],
    saving = [],
    spending,
  } = useTransactionsByCategory({
    endDate,
    startDate,
  });
  const groups =
    groupTransactions({
      groupBy: GroupBy.Variability,
      transactions: spending,
    }) ?? [];
  const fixedSpending =
    groups.find((group) => group.key === Variability.Fixed)?.transactions ?? [];
  const variableSpending =
    groups.find((group) => group.key === Variability.Variable)?.transactions ??
    [];
  const totals = buildTimeline({
    earliestDate: startDate,
    earning,
    fixedSpending,
    latestDate: endDate,
    saving,
    variableSpending,
  });
  const lastFullTotal = [...totals].reverse().find((group) => group.earning);
  const totalsBySeries = {
    afterFixedSpending: lastFullTotal?.afterFixedSpending,
    afterVariableSpending: lastFullTotal?.afterVariableSpending,
    earning: lastFullTotal?.earning,
    fixedSpending:
      (lastFullTotal?.fixedSpending?.[0] ?? 0) -
      (lastFullTotal?.fixedSpending?.[1] ?? 0),
    saving:
      (lastFullTotal?.saving?.[0] ?? 0) - (lastFullTotal?.saving?.[1] ?? 0),
    variableSpending:
      (lastFullTotal?.variableSpending?.[0] ?? 0) -
      (lastFullTotal?.variableSpending?.[1] ?? 0),
  };
  const earningTags = groupTransactions({
    groupBy: GroupBy.Tag,
    sortGroupsBy: SortGroupsBy.Total,
    transactions: earning,
  });
  const savingTags = groupTransactions({
    groupBy: GroupBy.Tag,
    sortGroupsBy: SortGroupsBy.Total,
    transactions: saving,
  });
  const fixedSpendingTags = groupTransactions({
    groupBy: GroupBy.Tag,
    sortGroupsBy: SortGroupsBy.Total,
    transactions: fixedSpending,
  });
  const variableSpendingTags = groupTransactions({
    groupBy: GroupBy.Tag,
    sortGroupsBy: SortGroupsBy.Total,
    transactions: variableSpending,
  });
  const tagAmountsBySeries = {
    [Series.Earning]: earningTags?.map((group) => ({
      amount: group.total,
      tag: group.key,
    })),
    [Series.FixedSpending]: fixedSpendingTags?.map((group) => ({
      amount: group.total,
      tag: group.key,
    })),
    [Series.Saving]: savingTags?.map((group) => ({
      amount: group.total,
      tag: group.key,
    })),
    [Series.VariableSpending]: variableSpendingTags?.map((group) => ({
      amount: group.total,
      tag: group.key,
    })),
  };
  return (
    <CashflowTimelinePanel
      tagAmountsBySeries={tagAmountsBySeries}
      totals={totals}
      totalsBySeries={totalsBySeries}
    />
  );
}
