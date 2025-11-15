import React, { FC, useEffect, useState } from 'react';

import AverageSpendingSummary from 'components/AverageSpendingSummary';
import Checkboxes from 'components/Checkboxes';
import SpendingByTagAndMonthGraph from 'components/SpendingByTagAndMonthGraph';
import useAveragingPeriod from 'hooks/useAveragingPeriod';
import useTagsByCategory from 'hooks/useTagsByCategory';
import useTransactionsByTag from 'hooks/useTransactionsByTag';
import TransactionsByTag from './TransactionsByTag';
import MonthlySpendingGraph from './MonthlySpendingGraph';
import PageWrapper from '../molecules/PageWrapper';

const Spending: FC = () => {
  const { count, endIso: endDate, startIso: startDate } = useAveragingPeriod();
  const { isLoading: isLoadingTransactionsByTag, spending: spendingByTag } =
    useTransactionsByTag({ endDate, startDate });
  const { isLoading, spending: spendingTags } = useTagsByCategory();
  const [selectedTags, setSelectedTags] = useState<string[] | undefined>();
  useEffect(() => {
    if (!isLoading && !selectedTags) setSelectedTags(spendingTags);
  }, [isLoading, selectedTags, setSelectedTags, spendingTags]);
  return (
    <PageWrapper name="spending">
      <AverageSpendingSummary />
      <MonthlySpendingGraph />
      <TransactionsByTag
        id="average-spending-by-tag"
        isGraphVisible
        isLoading={isLoadingTransactionsByTag}
        months={count}
        name="Average Spending by Tag"
        transactions={spendingByTag}
      />
      <SpendingByTagAndMonthGraph selectedTags={selectedTags} />
      <Checkboxes
        onChange={(newSelectedTags) => setSelectedTags(newSelectedTags)}
        options={spendingTags}
        selectedOptions={selectedTags || spendingTags}
      />
    </PageWrapper>
  );
};

export default Spending;
