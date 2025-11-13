import React, { FC, Fragment } from 'react';

import SectionContainer from 'components/SectionContainer';
import useCurrencyFormatter from 'hooks/useCurrencyFormatter';
import useMonth from 'hooks/useMonth';
import useTransactionsByCategory from 'hooks/useTransactionsByCategory';
import getTransactionsByDate from 'utils/getTransactionsByDate';
import LoadingIndicator from './atoms/LoadingIndicator';

const MonthlySavings: FC = () => {
  const { endDate, startDate } = useMonth();
  const { isLoading, saving } = useTransactionsByCategory({
    endDate,
    startDate,
  });
  const { format } = useCurrencyFormatter();

  const savingByDate = getTransactionsByDate({ transactions: saving });

  if (isLoading)
    return (
      <SectionContainer id="monthly-savings" title="Savings">
        <LoadingIndicator name="monthly-savings" />
      </SectionContainer>
    );

  return (
    <SectionContainer id="monthly-savings" title="Savings">
      {savingByDate.map(({ date, transactions }) => (
        <Fragment key={date}>
          <p>{date}</p>
          <ul>
            {transactions.map(({ amount, id, merchant, name, tag }) => (
              <li key={id}>
                {format({ value: amount })}
                &mdash;
                {merchant}
                &nbsp;&#40;
                {name}
                &#41;&nbsp;
                {tag}
              </li>
            ))}
          </ul>
        </Fragment>
      ))}
    </SectionContainer>
  );
};

export default MonthlySavings;
