import React, { FC, useState } from 'react';

import AddFilter from 'components/AddFilter';
import Button from 'components/Button';
import useCurrencyFormatter from 'hooks/useCurrencyFormatter';
import TransactionType from 'types/transaction';

const Transaction: FC<{
  isFilteringEnabled?: boolean;
  transaction: TransactionType;
}> = ({ isFilteringEnabled = false, transaction }) => {
  const { format } = useCurrencyFormatter();
  const [isFilterFormVisible, setIsFilterFormVisible] = useState<boolean>();
  const { amount, datetime, merchant, name } = transaction;
  return (
    <>
      <p>
        {format({ value: amount })}
        &mdash;
        {name}
        {merchant && (
          <>
            &nbsp;&#40;
            {merchant}
            &#41;
          </>
        )}
        &mdash;
        {datetime}
      </p>
      {isFilteringEnabled && !isFilterFormVisible && (
        <Button onClick={() => setIsFilterFormVisible(true)}>filter</Button>
      )}
      {isFilterFormVisible && <AddFilter transaction={transaction} />}
    </>
  );
};

export default Transaction;