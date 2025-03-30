import { useMemo } from 'react';

import useFilters from 'hooks/useFilters';
import useQuery from 'hooks/useQuery';
import { Comparator, Filter, Matcher } from 'types/filter';
import Transaction, {
  Category,
  CoreTransaction,
  TransactionType,
} from 'types/transaction';
import gql from 'utils/gql';

interface BaseResult {
  error?: Error;
  isLoading: boolean;
}

interface TransactionsByTypeResult extends BaseResult {
  credits?: Transaction[];
  debits?: Transaction[];
}

const useTransactions = ({
  endDate,
  isTestData,
  startDate,
}: {
  endDate: string;
  isFlat?: boolean;
  isTestData?: boolean;
  startDate: string;
}): TransactionsByTypeResult => {
  const {
    error: filtersError,
    isLoading: isLoadingFilters,
    filters = [],
  } = useFilters();
  const {
    data,
    error,
    loading: isLoading,
  } = useQuery<
    { transactions: CoreTransaction[] },
    { endDate: string; isTestData?: boolean; startDate: string }
  >(GET_TRANSACTIONS_QUERY, {
    pollInterval: 5 * 60 * 1000,
    variables: { endDate, isTestData, startDate },
  });
  const categorizedTransactions = useMemo(
    () => categorizeTransactions({ filters, transactions: data?.transactions }),
    [filters, data],
  );
  const { credits, debits } = useMemo(
    () => getTransactionsByType(categorizedTransactions),
    [categorizedTransactions],
  );
  return {
    credits,
    debits,
    error: error || filtersError,
    isLoading: isLoading || isLoadingFilters,
  };
};

export const GET_TRANSACTIONS_QUERY = gql`
  query GetTransactions(
    $startDate: String!
    $endDate: String!
    $isTestData: Boolean
  ) {
    transactions(
      input: {
        startDate: $startDate
        endDate: $endDate
        isTestData: $isTestData
      }
    ) {
      accountId
      amount
      datetime
      id
      merchant
      name
    }
  }
`;

export function categorizeTransactions({
  filters,
  transactions,
}: {
  filters?: Filter[];
  transactions?: CoreTransaction[];
} = {}): Transaction[] | undefined {
  if (!transactions) return undefined;
  const typedTransactions = transactions.map(addType);
  const fullTransactions = typedTransactions.map((transaction) =>
    applyFilters(transaction, filters),
  );
  return fullTransactions;
}

function addType(transaction: CoreTransaction): TypedTransaction {
  const type =
    transaction.amount >= 0 ? TransactionType.Debit : TransactionType.Credit;
  return {
    ...transaction,
    amount: Math.abs(transaction.amount),
    type,
  };
}

interface TypedTransaction extends CoreTransaction {
  type: TransactionType;
}

function applyFilters(
  transaction: TypedTransaction,
  filters: Filter[] | undefined,
): Transaction {
  const matchingFilter = filters?.find(({ matchers }) =>
    isMatchersMatch({ matchers, transaction }),
  );
  const defaultCategory =
    transaction.type === TransactionType.Debit
      ? Category.Spending
      : Category.Earning;
  const {
    categoryToAssign = defaultCategory,
    id,
    tagToAssign,
    variabilityToAssign,
  } = matchingFilter || {};
  return {
    ...transaction,
    category: categoryToAssign,
    filteredBy: id,
    tag: tagToAssign,
    variability: variabilityToAssign,
  };
}

function isMatchersMatch({
  matchers,
  transaction,
}: {
  matchers: Matcher[];
  transaction: CoreTransaction;
}): boolean {
  if (matchers.length === 0) return false;
  return matchers.every((matcher: Matcher) =>
    isMatcherMatch({ matcher, transaction }),
  );
}

function isMatcherMatch({
  matcher: { comparator = Comparator.Equals, expectedValue, property },
  transaction,
}: {
  matcher: Matcher;
  transaction: CoreTransaction;
}): boolean {
  if (!(property in transaction)) return false;
  const actualValue = transaction[property as keyof CoreTransaction];
  switch (comparator) {
    case Comparator.Equals:
      return actualValue === expectedValue;
    case Comparator.GreaterThan:
      return actualValue > expectedValue;
    case Comparator.LessThan:
      return actualValue < expectedValue;
    default:
      return false;
  }
}

function getTransactionsByType(transactions: Transaction[] | undefined): {
  credits?: Transaction[];
  debits?: Transaction[];
} {
  if (!transactions) return {};
  const credits = transactions.filter(
    ({ type }) => type === TransactionType.Credit,
  );
  const debits = transactions.filter(
    ({ type }) => type === TransactionType.Debit,
  );
  return { credits, debits };
}

export default useTransactions;
