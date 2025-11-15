import React, { FC, Fragment } from 'react';

import useCurrencyFormatter from 'hooks/useCurrencyFormatter';
import useMonth from 'hooks/useMonth';
import useTransactionsByCategory from 'hooks/useTransactionsByCategory';
import getTransactionsByDate from 'utils/getTransactionsByDate';
import SectionContainer from './SectionContainer';
import LoadingIndicator from '../atoms/LoadingIndicator';

const MonthlyEarnings: FC = () => {
  const { endDate, startDate } = useMonth();
  const { earning, isLoading } = useTransactionsByCategory({
    endDate,
    startDate,
  });
  const { format } = useCurrencyFormatter();

  const earningsByDate = getTransactionsByDate({ transactions: earning });

  if (isLoading)
    return (
      <SectionContainer id="monthly-earnings" title="Earnings">
        <LoadingIndicator name="monthly-earnings" />
      </SectionContainer>
    );

  return (
    <SectionContainer id="monthly-earnings" title="Earnings">
      {earningsByDate.map(({ date, transactions }) => (
        <Fragment key={date}>
          <p>{date}</p>
          <ul>
            {transactions.map(({ amount, id, merchant, name }) => (
              <li key={id}>
                {format({ value: amount })}
                &mdash;
                {merchant}
                &nbsp;&#40;
                {name}
                &#41;
              </li>
            ))}
          </ul>
        </Fragment>
      ))}
    </SectionContainer>
  );
};

export default MonthlyEarnings;
