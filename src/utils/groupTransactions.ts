import { DateTime } from 'luxon';

import type Transaction from 'types/transaction';
import { Variability as TransactionVariability } from 'types/variability';

export function groupTransactions({
  groupBy = GroupBy.Date,
  sortGroupsBy = SortGroupsBy.Key,
  sortGroupsDirection = SortDirection.Desc,
  sortTransactionsBy = SortTransactionsBy.Amount,
  sortTransactionsDirection = SortDirection.Desc,
  transactions,
}: {
  groupBy?: GroupBy;
  sortGroupsBy?: SortGroupsBy;
  sortGroupsDirection?: SortDirection;
  sortTransactionsBy?: SortTransactionsBy;
  sortTransactionsDirection?: SortDirection;
  transactions?: Transaction[];
}): Group[] | undefined {
  if (!transactions) return undefined;
  const groupedTransactions = transactions.reduce(
    (groups: Record<string, Transaction[]>, transaction) => {
      const key = getKey(transaction, groupBy);
      const existingTransactions = groups[key] || [];
      return {
        ...groups,
        [key]: [...existingTransactions, transaction],
      };
    },
    {},
  );
  const groups = Object.entries(groupedTransactions).map(
    ([key, keyTransactions]) => ({
      key,
      transactions: keyTransactions,
    }),
  );
  const groupsWithTotals = groups.map((group) => {
    const total = group.transactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0,
    );
    return { ...group, total };
  });
  const groupsWithSortedTransactions = groupsWithTotals.map((group) => ({
    ...group,
    transactions: group.transactions.sort((a, b) => {
      const aKey = getTransactionSortKey(a, sortTransactionsBy);
      const bKey = getTransactionSortKey(b, sortTransactionsBy);
      if (aKey > bKey && sortTransactionsDirection === SortDirection.Desc)
        return -1;
      return 1;
    }),
  }));
  const sortedGroups = groupsWithSortedTransactions.sort((a, b) => {
    const aKey = getGroupSortKey(a, sortGroupsBy);
    const bKey = getGroupSortKey(b, sortGroupsBy);
    if (aKey > bKey && sortGroupsDirection === SortDirection.Desc) return -1;
    return 1;
  });
  return sortedGroups;
}

export enum GroupBy {
  Category = 'Category',
  Date = 'Date',
  Month = 'Month',
  Tag = 'Tag',
  Variability = 'Variability',
}

export enum SortDirection {
  Asc,
  Desc,
}

export enum SortGroupsBy {
  Key = 'Key',
  Total = 'Total',
}

export enum SortTransactionsBy {
  Amount,
  Date,
}

export interface Group {
  key: string;
  total: number;
  transactions: Transaction[];
}

function getKey(transaction: Transaction, groupBy: GroupBy): string {
  switch (groupBy) {
    case GroupBy.Category:
      return transaction.category;
    case GroupBy.Month:
      return DateTime.fromISO(transaction.datetime).toFormat('yyyy-LL');
    case GroupBy.Tag:
      return transaction.tag || 'Untagged';
    case GroupBy.Variability:
      return transaction.variability || TransactionVariability.Variable;
    case GroupBy.Date:
    default:
      return transaction.datetime;
  }
}

function getGroupSortKey(
  group: Group,
  sortGroupsBy: SortGroupsBy,
): string | number {
  switch (sortGroupsBy) {
    case SortGroupsBy.Total:
      return Math.abs(group.total);
    case SortGroupsBy.Key:
    default:
      return group.key;
  }
}

function getTransactionSortKey(
  transaction: Transaction,
  sortTransactionsBy: SortTransactionsBy,
): string | number {
  switch (sortTransactionsBy) {
    case SortTransactionsBy.Amount:
      return transaction.amount;
    case SortTransactionsBy.Date:
    default:
      return transaction.datetime;
  }
}

export default groupTransactions;
