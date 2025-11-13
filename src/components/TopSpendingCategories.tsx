import React, { FC, useState } from 'react';

import Link from 'components/Link';
import Transaction from 'components/Transaction';
import LoadingIndicator from 'components/LoadingIndicator';
import useAveragingPeriod from 'hooks/useAveragingPeriod';
import useCurrencyFormatter from 'hooks/useCurrencyFormatter';
import useMonth from 'hooks/useMonth';
import useTransactionsByTag from 'hooks/useTransactionsByTag';
import type TransactionType from 'types/transaction';
import Button from './atoms/Button';

const TopSpendingCategories: FC = () => {
  const {
    endDate: endOfMonth,
    nextMonth,
    previousMonth,
    readable: readableMonth,
    startDate: startOfMonth,
  } = useMonth();
  const {
    count: averagingCount,
    endIso: endOfAveragingPeriod,
    startIso: startOfAveragingPeriod,
  } = useAveragingPeriod();
  const { isLoading, spending } = useTransactionsByTag({
    endDate: endOfMonth,
    startDate: startOfMonth,
  });
  const { isLoading: isLoadingAverages, spending: averageSpending } =
    useTransactionsByTag({
      endDate: endOfAveragingPeriod,
      startDate: startOfAveragingPeriod,
    });
  if (isLoading || isLoadingAverages) return <LoadingIndicator />;
  const averageSpendingByTag: Record<string, number> = averageSpending.reduce(
    (result, { tag, totalAmount }) => ({
      ...result,
      [tag]: totalAmount / averagingCount,
    }),
    {},
  );
  return (
    <>
      <Link href={`/top-spending-categories/${previousMonth}`}>previous</Link>
      <Link href={`/top-spending-categories/${nextMonth}`}>next</Link>
      <h2>{`Top Spending Categories: ${readableMonth}`}</h2>
      <ul data-testid="categories">
        {spending.map(({ tag, totalAmount, transactions }) => (
          <Category
            averageAmount={averageSpendingByTag[tag]}
            key={tag}
            tag={tag}
            totalAmount={totalAmount}
            transactions={transactions}
          />
        ))}
      </ul>
    </>
  );
};

const Category: FC<{
  averageAmount?: number;
  tag: string;
  totalAmount: number;
  transactions: TransactionType[];
}> = ({ averageAmount = 0, tag, totalAmount, transactions }) => {
  const { format } = useCurrencyFormatter();
  const [isExpanded, setIsExpanded] = useState(false);

  const difference = Math.abs(totalAmount - averageAmount);
  const aboveOrBelow = totalAmount >= averageAmount ? 'above' : 'below';
  const text = ` ${tag}: ${format({ value: totalAmount })} (${format({
    value: difference,
  })} ${aboveOrBelow} average)`;

  return (
    <li data-testid={`category-${tag}`} key={tag}>
      <p>{text}</p>
      <Button onClick={() => setIsExpanded(!isExpanded)}>toggle</Button>
      {isExpanded && (
        <ul>
          {transactions
            .sort(({ amount: firstAmount }, { amount: secondAmount }) =>
              firstAmount > secondAmount ? -1 : 1,
            )
            .map((transaction) => (
              <li key={transaction.id}>
                <Transaction
                  isFilteringEnabled={tag === 'Untagged'}
                  transaction={transaction}
                />
              </li>
            ))}
        </ul>
      )}
    </li>
  );
};

export default TopSpendingCategories;
