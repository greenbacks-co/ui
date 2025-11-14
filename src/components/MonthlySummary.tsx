import React, { FC } from 'react';

import ArticleContainer from 'components/ArticleContainer';
import MonthlyEarnings from 'components/MonthlyEarnings';
import MonthlyExpenses from 'components/MonthlyExpenses';
import MonthlySavings from 'components/MonthlySavings';
import MonthlyOverview from 'components/MonthlyOverview';
import SectionContainer from 'components/SectionContainer';
import TransactionsByTag from 'components/TransactionsByTag';
import Transactions from 'components/Transactions';
import useMonth from 'hooks/useMonth';
import useTransactionsByTag from 'hooks/useTransactionsByTag';
import useUntaggedTransactions from 'hooks/useUntaggedTransactions';
import MonthSelector from './organisms/MonthSelector';

const MonthlySummary: FC = () => {
  const { endDate, startDate } = useMonth();
  const { isLoading, spending } = useTransactionsByTag({ endDate, startDate });
  const { spending: untaggedSpending } = useUntaggedTransactions({
    endDate,
    startDate,
  });
  return (
    <ArticleContainer id="monthly-summary" title="Monthly Summary">
      <MonthSelector />
      <MonthlyOverview />
      <TransactionsByTag
        id="monthly-spending-by-tag"
        isGraphVisible
        isLoading={isLoading}
        transactions={spending}
      />
      {untaggedSpending && (
        <SectionContainer
          id="untagged-monthly-spending"
          isCollapsible
          title={`Untagged Spending (${untaggedSpending.length})`}
        >
          <Transactions transactions={untaggedSpending} />
        </SectionContainer>
      )}
      <MonthlyEarnings />
      <MonthlySavings />
      <MonthlyExpenses />
    </ArticleContainer>
  );
};

export default MonthlySummary;
