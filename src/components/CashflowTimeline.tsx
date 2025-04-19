import { DateTime } from 'luxon';
import React, { ReactElement } from 'react';

import useMonth from 'hooks/useMonth';
import useTransactionsByCategory from 'hooks/useTransactionsByCategory';
import Transaction from 'types/transaction';
import { Variability } from 'types/variability';
import groupTransactions, { GroupBy } from 'utils/groupTransactions';
import { Cashflow, Series, Totals } from './NewCashflow';

export function CashflowTimeline({
  totals = [],
}: {
  totals?: Totals[];
}): ReactElement {
  return (
    <Cashflow
      formatAxisLabel={(value) =>
        DateTime.fromISO(value).toLocaleString({
          day: 'numeric',
          month: 'long',
        })
      }
      totals={totals}
    />
  );
}

export function CashflowTimelineContainer(): ReactElement {
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
  return <CashflowTimeline totals={totals} />;
}

export function buildTimeline({
  earliestDate,
  earning = [],
  fixedSpending = [],
  latestDate,
  saving = [],
  variableSpending = [],
}: {
  earliestDate?: string;
  earning?: Transaction[];
  fixedSpending?: Transaction[];
  latestDate?: string;
  saving?: Transaction[];
  variableSpending?: Transaction[];
}): Totals[] {
  const fixedSpendingByDay = groupTransactions({
    groupBy: GroupBy.Date,
    transactions: fixedSpending,
  });
  const earningByDay = groupTransactions({
    groupBy: GroupBy.Date,
    transactions: earning,
  });
  const savingByDay = groupTransactions({
    groupBy: GroupBy.Date,
    transactions: saving,
  });
  const variableSpendingByDay = groupTransactions({
    groupBy: GroupBy.Date,
    transactions: variableSpending,
  });
  const seriesTotalsByDay: Record<string, Partial<Record<Series, number>>> = {};
  earningByDay?.forEach((group) => {
    const day: Partial<Record<Series, number>> =
      seriesTotalsByDay[group.key] ?? {};
    day[Series.Earning] = group.total;
    seriesTotalsByDay[group.key] = day;
  });
  fixedSpendingByDay?.forEach((group) => {
    const day: Partial<Record<Series, number>> =
      seriesTotalsByDay[group.key] ?? {};
    day[Series.FixedSpending] = group.total;
    seriesTotalsByDay[group.key] = day;
  });
  savingByDay?.forEach((group) => {
    const day: Partial<Record<Series, number>> =
      seriesTotalsByDay[group.key] ?? {};
    day[Series.Saving] = group.total;
    seriesTotalsByDay[group.key] = day;
  });
  variableSpendingByDay?.forEach((group) => {
    const day: Partial<Record<Series, number>> =
      seriesTotalsByDay[group.key] ?? {};
    day[Series.VariableSpending] = group.total;
    seriesTotalsByDay[group.key] = day;
  });
  const sortedPresentDays = Object.keys(seriesTotalsByDay).sort();
  const earliestObservedDate = sortedPresentDays[0];
  const latestObservedDate = sortedPresentDays[sortedPresentDays.length - 1];
  let runningEarning = 0;
  let runningFixedSpending = 0;
  let runningSaving = 0;
  let runningVariableSpending = 0;
  const totals: Totals[] = [];
  for (
    let i = DateTime.fromISO(earliestObservedDate);
    i <= DateTime.fromISO(latestObservedDate);
    i = i.plus({ days: 1 })
  ) {
    const currentDay = i.toISODate();
    runningEarning += seriesTotalsByDay[currentDay]?.[Series.Earning] ?? 0;
    runningSaving += seriesTotalsByDay[currentDay]?.[Series.Saving] ?? 0;
    runningFixedSpending +=
      seriesTotalsByDay[currentDay]?.[Series.FixedSpending] ?? 0;
    runningVariableSpending +=
      seriesTotalsByDay[currentDay]?.[Series.VariableSpending] ?? 0;
    const afterSaving = runningEarning - runningSaving;
    const afterBills = afterSaving - runningFixedSpending;
    const afterFun = afterBills - runningVariableSpending;
    totals.push({
      afterVariableSpending: afterFun,
      earning: runningEarning,
      fixedSpending: [afterSaving, afterBills],
      key: currentDay,
      saving: [runningEarning, afterSaving],
      variableSpending: [afterBills, afterFun],
    });
  }
  if (earliestDate && earliestDate < earliestObservedDate) {
    for (
      let i = DateTime.fromISO(earliestObservedDate);
      i < DateTime.fromISO(earliestDate);
      i = i.plus({ days: 1 })
    ) {
      totals.unshift({ key: i.toISODate() });
    }
  }
  if (latestDate && latestDate > latestObservedDate) {
    for (
      let i = DateTime.fromISO(latestObservedDate).plus({ days: 1 });
      i <= DateTime.fromISO(latestDate);
      i = i.plus({ days: 1 })
    ) {
      totals.push({ key: i.toISODate() });
    }
  }
  return totals;
}
