import { DateTime } from 'luxon';
import { Variability } from 'types/variability';
import groupTransactions, { GroupBy } from 'utils/groupTransactions';
import Transaction from '../types/transaction';
import useTransactionsByCategory from './useTransactionsByCategory';

export function useCategorizedTransactions({
  startDate,
  endDate,
}: {
  startDate: DateTime;
  endDate: DateTime;
}): {
  fixedEarning: CategoryGroup;
  fixedSaving: CategoryGroup;
  fixedSpending: CategoryGroup;
  isLoading: boolean;
  variableEarning: CategoryGroup;
  variableSaving: CategoryGroup;
  variableSpending: CategoryGroup;
} {
  const { earning, isLoading, saving, spending } = useTransactionsByCategory({
    startDate: startDate.toISODate(),
    endDate: endDate.toISODate(),
  });
  const { fixed: fixedEarning, variable: variableEarning } = splitCategory({
    name: 'Earning',
    transactions: earning,
  });
  const { fixed: fixedSaving, variable: variableSaving } = splitCategory({
    name: 'Saving',
    transactions: saving,
  });
  const { fixed: fixedSpending, variable: variableSpending } = splitCategory({
    name: 'Spending',
    transactions: spending,
  });
  return {
    fixedEarning,
    fixedSaving,
    fixedSpending,
    isLoading,
    variableEarning,
    variableSaving,
    variableSpending,
  };
}

export interface CategoryGroup {
  name: string;
  tags: TagGroup[];
  total: number;
  transactions: Transaction[];
}

export interface TagGroup {
  name: string;
  total: number;
  transactions: Transaction[];
}

function splitCategory({
  name,
  transactions,
}: {
  name: string;
  transactions?: Transaction[];
}): {
  fixed: CategoryGroup;
  variable: CategoryGroup;
} {
  const groups = groupTransactions({
    groupBy: GroupBy.Variability,
    transactions,
  });
  const fixed = groups?.find((group) => group.key === Variability.Fixed);
  const variable = groups?.find((group) => group.key === Variability.Variable);
  const fixedTags = groupTransactions({
    groupBy: GroupBy.Tag,
    transactions: fixed?.transactions,
  });
  const variableTags = groupTransactions({
    groupBy: GroupBy.Tag,
    transactions: variable?.transactions,
  });
  return {
    fixed: {
      name: `Fixed ${name}`,
      tags: fixedTags?.map((group) => ({ ...group, name: group.key })) ?? [],
      total: fixed?.total ?? 0,
      transactions: fixed?.transactions ?? [],
    },
    variable: {
      name: `Variable ${name}`,
      tags: variableTags?.map((group) => ({ ...group, name: group.key })) ?? [],
      total: variable?.total ?? 0,
      transactions: variable?.transactions ?? [],
    },
  };
}
