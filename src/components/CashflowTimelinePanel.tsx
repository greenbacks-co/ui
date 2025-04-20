import React, { ReactElement } from 'react';

import useCurrencyFormatter from 'hooks/useCurrencyFormatter';
import useMonth from 'hooks/useMonth';
import useTransactionsByCategory from 'hooks/useTransactionsByCategory';
import { Variability } from 'types/variability';
import groupTransactions, { GroupBy } from 'utils/groupTransactions';
import { buildTimeline, CashflowTimeline } from './CashflowTimeline';
import { LABELS_BY_SERIES, Series, Totals } from './NewCashflow';
import { Panel, PanelItem } from './Panel';
import { Text } from './Text';
import List, { Item } from './List';
import { JustifiedRow } from './JustifiedRow';

export function CashflowTimelinePanel({
  labelsBySeries = LABELS_BY_SERIES,
  totals = [],
  totalsBySeries = {},
}: {
  labelsBySeries?: Partial<Record<Series, string>>;
  totals?: Totals[];
  totalsBySeries?: Partial<Record<Series, number>>;
}): ReactElement {
  const { format } = useCurrencyFormatter();
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
        {[
          Series.Earning,
          Series.Saving,
          Series.FixedSpending,
          Series.AfterFixedSpending,
          Series.VariableSpending,
          Series.AfterVariableSpending,
        ].map((series) => (
          <Item>
            <JustifiedRow>
              <Text>{format(totalsBySeries[series] ?? 0)}</Text>
              <Text>{labelsBySeries[series]}</Text>
            </JustifiedRow>
          </Item>
        ))}
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
  return (
    <CashflowTimelinePanel totals={totals} totalsBySeries={totalsBySeries} />
  );
}
