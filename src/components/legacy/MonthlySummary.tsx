import React, { FC } from 'react';

import useMonth from 'hooks/useMonth';
import useTransactionsByTag from 'hooks/useTransactionsByTag';
import useUntaggedTransactions from 'hooks/useUntaggedTransactions';
import ArticleContainer from '../ArticleContainer';
import MonthlyEarnings from '../MonthlyEarnings';
import MonthlyExpenses from '../MonthlyExpenses';
import MonthlySavings from '../MonthlySavings';
import MonthlyOverview from './MonthlyOverview';
import SectionContainer from '../SectionContainer';
import TransactionsByTag from '../TransactionsByTag';
import Transactions from '../Transactions';
import MonthSelector from '../organisms/MonthSelector';

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
