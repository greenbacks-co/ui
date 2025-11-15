import { DateTime } from 'luxon';
import React, { ReactElement } from 'react';

import useTransactionsByCategory from 'hooks/useTransactionsByCategory';
import useNow from 'hooks/useNow';
import Transaction from 'types/transaction';
import { Variability } from 'types/variability';
import groupTransactions, { GroupBy } from 'utils/groupTransactions';
import { Panel, PanelItem } from '../atoms/Panel';
import { Text } from '../atoms/Text';
import { Cashflow, Series } from '../atoms/charts/CashflowTimeline';

export function TotalsByMonth({
  monthTotals = [],
}: {
  monthTotals?: Month[];
}): ReactElement {
  return (
    <Cashflow
      formatAxisLabel={(value) =>
        DateTime.fromISO(value).toLocaleString({
          month: 'long',
          year: 'numeric',
        })
      }
      hasLabels
      isWide
      totals={formatDataForAreaChart(monthTotals)}
    />
  );
}

export interface Month extends Partial<Record<Series, number>> {
  month: string;
}

function formatDataForAreaChart(months: Month[]): {
  key: string;
  [Series.AfterVariableSpending]: number;
  [Series.Earning]: number;
  [Series.FixedSpending]: [number, number];
  [Series.Saving]: [number, number];
  [Series.VariableSpending]: [number, number];
}[] {
  return months.map((month) => ({
    key: month.month,
    [Series.AfterFixedSpending]: month[Series.AfterFixedSpending] ?? 0,
    [Series.AfterVariableSpending]: month[Series.AfterVariableSpending] ?? 0,
    [Series.Earning]: month[Series.Earning] ?? 0,
    [Series.FixedSpending]: [
      month[Series.AfterSaving] ?? 0,
      month[Series.AfterFixedSpending] ?? 0,
    ],
    [Series.Saving]: [
      month[Series.Earning] ?? 0,
      month[Series.AfterSaving] ?? 0,
    ],
    [Series.VariableSpending]: [
      month[Series.AfterFixedSpending] ?? 0,
      month[Series.AfterVariableSpending] ?? 0,
    ],
  }));
}

function TotalsByMonthPanel({
  area,
  monthTotals,
}: {
  area?: string;
  monthTotals: Month[];
}): ReactElement {
  return (
    <Panel area={area}>
      <PanelItem hasBottomBorder>
        <Text>Cashflow Trends</Text>
      </PanelItem>
      <PanelItem>
        <TotalsByMonth monthTotals={monthTotals} />
      </PanelItem>
    </Panel>
  );
}

export function TotalsByMonthPanelContainer({
  area,
}: {
  area?: string;
}): ReactElement {
  const { now } = useNow();
  const endDate = now.minus({ months: 1 }).endOf('month').toISODate();
  const startDate = now.minus({ months: 12 }).startOf('month').toISODate();
  const { earning, saving, spending } = useTransactionsByCategory({
    endDate,
    startDate,
  });
  const monthTotals = getMonthTotals({ earning, saving, spending });
  return <TotalsByMonthPanel area={area} monthTotals={monthTotals} />;
}

function getMonthTotals({
  earning = [],
  saving = [],
  spending = [],
}: {
  earning?: Transaction[];
  saving?: Transaction[];
  spending?: Transaction[];
}): Month[] {
  const spendingGroups =
    groupTransactions({
      groupBy: GroupBy.Variability,
      transactions: spending,
    }) ?? [];
  const fixedSpending =
    spendingGroups.find((group) => group.key === Variability.Fixed)
      ?.transactions ?? [];
  const variableSpending =
    spendingGroups.find((group) => group.key === Variability.Variable)
      ?.transactions ?? [];
  const earningByMonth = groupTransactions({
    groupBy: GroupBy.Month,
    transactions: earning,
  });
  const savingByMonth = groupTransactions({
    groupBy: GroupBy.Month,
    transactions: saving,
  });
  const fixedSpendingByMonth = groupTransactions({
    groupBy: GroupBy.Month,
    transactions: fixedSpending,
  });
  const variableSpendingByMonth = groupTransactions({
    groupBy: GroupBy.Month,
    transactions: variableSpending,
  });
  const totalsByMonth: Record<string, Month> = {};
  earningByMonth?.forEach((month) => {
    const totalsSoFar = totalsByMonth[month.key] ?? {};
    totalsByMonth[month.key] = {
      ...totalsSoFar,
      earning: month.total,
      month: month.key,
    };
  });
  savingByMonth?.forEach((month) => {
    const totalsSoFar = totalsByMonth[month.key] ?? {};
    totalsByMonth[month.key] = {
      ...totalsSoFar,
      saving: month.total,
      month: month.key,
    };
  });
  fixedSpendingByMonth?.forEach((month) => {
    const totalsSoFar = totalsByMonth[month.key] ?? {};
    totalsByMonth[month.key] = {
      ...totalsSoFar,
      fixedSpending: month.total,
      month: month.key,
    };
  });
  variableSpendingByMonth?.forEach((month) => {
    const totalsSoFar = totalsByMonth[month.key] ?? {};
    totalsByMonth[month.key] = {
      ...totalsSoFar,
      variableSpending: month.total,
      month: month.key,
    };
  });
  const result = Object.values(totalsByMonth)
    .sort((a, b) => (a.month > b.month ? 1 : -1))
    .map((month) => {
      const afterSaving = (month.earning ?? 0) - (month.saving ?? 0);
      const afterFixedSpending = afterSaving - (month.fixedSpending ?? 0);
      const afterVariableSpending =
        afterFixedSpending - (month.variableSpending ?? 0);
      return {
        ...month,
        afterFixedSpending,
        afterSaving,
        afterVariableSpending,
      };
    });
  return result;
}
