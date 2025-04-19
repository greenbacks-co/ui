import React, { ReactElement } from 'react';

import useMonth from 'hooks/useMonth';
import useTransactionsByCategory from 'hooks/useTransactionsByCategory';
import { Variability } from 'types/variability';
import groupTransactions, { GroupBy } from 'utils/groupTransactions';
import { buildTimeline, CashflowTimeline } from './CashflowTimeline';
import { Totals } from './NewCashflow';
import { Panel, PanelItem } from './Panel';
import { Text } from './Text';

export function CashflowTimelinePanel({
  totals = [],
}: {
  totals?: Totals[];
}): ReactElement {
  return (
    <Panel>
      <PanelItem hasBottomBorder>
        <Text>Cashflow Timeline</Text>
      </PanelItem>
      <PanelItem>
        <CashflowTimeline totals={totals} />
      </PanelItem>
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
  return <CashflowTimelinePanel totals={totals} />;
}
