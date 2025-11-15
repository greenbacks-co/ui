import React, { FC } from 'react';

import useAveragingPeriod from 'hooks/useAveragingPeriod';
import useTransactionsByTag from 'hooks/useTransactionsByTag';
import TransactionsByTag from './TransactionsByTag';

const AverageSpendingByTag: FC = () => {
  const { count, endIso: endDate, startIso: startDate } = useAveragingPeriod();
  const { isLoading, spending } = useTransactionsByTag({ endDate, startDate });
  return (
    <TransactionsByTag
      id="average-spending-by-tag"
      isGraphVisible
      isLoading={isLoading}
      months={count}
      name="Average Spending by Tag"
      transactions={spending}
    />
  );
};

export default AverageSpendingByTag;
