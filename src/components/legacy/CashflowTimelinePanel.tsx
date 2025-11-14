import React, { ReactElement } from 'react';
import styled from 'styled-components';

import useCurrencyFormatter from 'hooks/useCurrencyFormatter';
import useMonth from 'hooks/useMonth';
import useTransactionsByCategory from 'hooks/useTransactionsByCategory';
import Transaction from 'types/transaction';
import { Variability } from 'types/variability';
import groupTransactions, {
  GroupBy,
  SortGroupsBy,
} from 'utils/groupTransactions';
import { buildTimeline, CashflowTimeline } from '../CashflowTimeline';
import { LABELS_BY_SERIES, Series, Totals } from '../NewCashflow';
import { Panel, PanelItem } from '../atoms/Panel';
import { Size, Text } from '../atoms/Text';
import List, { ExpanderContainer as Expander, Item } from '../atoms/List';
import { Row } from '../atoms/Row';

export function CashflowTimelinePanel({
  labelsBySeries = LABELS_BY_SERIES,
  remainingAmountsBySeries = {},
  tagAmountsBySeries = {},
  totals = [],
  totalsBySeries = {},
}: {
  labelsBySeries?: Partial<Record<Series, string>>;
  remainingAmountsBySeries?: Partial<Record<Series, number>>;
  tagAmountsBySeries?: Partial<Record<Series, TagAmount[]>>;
  totals?: Totals[];
  totalsBySeries?: Partial<Record<Series, number>>;
}): ReactElement {
  const { format } = useCurrencyFormatter();
  const seriesList = [
    Series.Earning,
    Series.Saving,
    Series.FixedSpending,
    Series.VariableSpending,
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
          const remainingAmount = remainingAmountsBySeries[series];
          const tagAmounts = tagAmountsBySeries[series] ?? [];
          return (
            <Expander
              body={
                <List
                  hasOutsideBorder={false}
                  hasRoundedBottomCorners={isLastItem}
                  hasRoundedTopCorners={false}
                  isInset
                >
                  {tagAmounts.map(({ amount, tag }) => (
                    <Item key={tag}>
                      <Row>
                        <Text>{tag}</Text>
                        <Text>{format(amount)}</Text>
                      </Row>
                    </Item>
                  ))}
                </List>
              }
              heading={
                <GridRow>
                  <Text area="amount">
                    {format(totalsBySeries[series] ?? 0)}
                  </Text>
                  {remainingAmount && (
                    <Text area="remainder" size={Size.Small}>
                      {format(remainingAmount)}
                    </Text>
                  )}
                  <Text area="label">{labelsBySeries[series]}</Text>
                </GridRow>
              }
              key={series}
            />
          );
        })}
      </List>
    </Panel>
  );
}

interface TagAmount {
  amount: number;
  tag: string;
}

const GridRow = styled.div`
  align-items: center;
  display: grid;
  grid-gap: 32px;
  grid-template-areas: 'amount remainder label';
  grid-template-columns: max-content 1fr max-content;
`;

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
  const totalsBySeries = getTotalsBySeries({ totals });
  const tagAmountsBySeries = getTagAmountsBySeries({
    earning,
    fixedSpending,
    saving,
    variableSpending,
  });
  const remainingAmountsBySeries = getRemainingAmountsBySeries({
    totalsBySeries,
  });
  return (
    <CashflowTimelinePanel
      remainingAmountsBySeries={remainingAmountsBySeries}
      tagAmountsBySeries={tagAmountsBySeries}
      totals={totals}
      totalsBySeries={totalsBySeries}
    />
  );
}

function getTotalsBySeries({
  totals = [],
}: {
  totals?: Totals[];
}): Partial<Record<Series, number>> {
  const lastFullTotal = [...totals]
    .reverse()
    .find((group) => group.earning !== undefined);
  const totalsBySeries = {
    earning: lastFullTotal?.earning ?? 0,
    fixedSpending:
      (lastFullTotal?.fixedSpending?.[0] ?? 0) -
      (lastFullTotal?.fixedSpending?.[1] ?? 0),
    saving:
      (lastFullTotal?.saving?.[0] ?? 0) - (lastFullTotal?.saving?.[1] ?? 0),
    variableSpending:
      (lastFullTotal?.variableSpending?.[0] ?? 0) -
      (lastFullTotal?.variableSpending?.[1] ?? 0),
  };
  return totalsBySeries;
}

function getTagAmountsBySeries({
  earning = [],
  fixedSpending = [],
  saving = [],
  variableSpending = [],
}: {
  earning?: Transaction[];
  fixedSpending?: Transaction[];
  saving?: Transaction[];
  variableSpending?: Transaction[];
}): Partial<Record<Series, TagAmount[]>> {
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
  return tagAmountsBySeries;
}

function getRemainingAmountsBySeries({
  totalsBySeries = {},
}: {
  totalsBySeries?: Partial<Record<Series, number>>;
}): Partial<Record<Series, number>> {
  const earning = totalsBySeries[Series.Earning] ?? 0;
  const saving = totalsBySeries[Series.Saving] ?? 0;
  const fixedSpending = totalsBySeries[Series.FixedSpending] ?? 0;
  const variableSpending = totalsBySeries[Series.VariableSpending] ?? 0;
  const afterSaving = earning - saving;
  const afterFixedSpending = afterSaving - fixedSpending;
  const afterVariableSpending = afterFixedSpending - variableSpending;
  const remainingAmountsBySeries = {
    [Series.FixedSpending]: afterFixedSpending,
    [Series.Saving]: afterSaving,
    [Series.VariableSpending]: afterVariableSpending,
  };
  return remainingAmountsBySeries;
}
