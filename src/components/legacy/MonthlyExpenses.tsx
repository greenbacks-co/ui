import React, { FC, Fragment } from 'react';

import useCurrencyFormatter from 'hooks/useCurrencyFormatter';
import useMonth from 'hooks/useMonth';
import useTransactionsByCategory from 'hooks/useTransactionsByCategory';
import getTransactionsByDate from 'utils/getTransactionsByDate';
import SectionContainer from './SectionContainer';
import LoadingIndicator from '../atoms/LoadingIndicator';

const MonthlyExpenses: FC = () => {
  const { endDate, startDate } = useMonth();
  const { format } = useCurrencyFormatter();
  const { isLoading, spending } = useTransactionsByCategory({
    endDate,
    startDate,
  });
  const spendingByDate = getTransactionsByDate({ transactions: spending });

  if (isLoading)
    return (
      <SectionContainer id="monthly-expenses" title="Spending">
        <LoadingIndicator name="monthly-expenses" />
      </SectionContainer>
    );

  return (
    <SectionContainer id="monthly-expenses" title="Spending">
      {spendingByDate.map(({ date, transactions }) => (
        <Fragment key={date}>
          <p>{date}</p>
          <ul>
            {transactions?.map(({ amount, id, merchant, name, tag }) => {
              const formattedAmount = format({ value: amount });
              return (
                <li key={id}>
                  {formattedAmount}
                  &mdash;
                  {merchant || 'no merchant'}
                  &nbsp;&#40;
                  {name}
                  &#41;&nbsp;
                  {tag}
                </li>
              );
            })}
          </ul>
        </Fragment>
      ))}
    </SectionContainer>
  );
};

export default MonthlyExpenses;
