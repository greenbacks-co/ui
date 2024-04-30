import React, { FC } from 'react';

import List, { Item } from 'components/List';
import Transaction from 'components/Transaction';
import useCurrencyFormatter from 'hooks/useCurrencyFormatter';
import TransactionType from 'types/transaction';
import groupTransactions, {
  GroupBy,
  SortGroupsBy,
} from 'utils/groupTransactions';
import styled from 'utils/styled';

const Transactions: FC<{
  groupBy?: GroupBy;
  sortGroupsBy?: SortGroupsBy;
  transactions: TransactionType[];
}> = ({
  groupBy = GroupBy.Date,
  sortGroupsBy = SortGroupsBy.Key,
  transactions,
}) => {
  const { format } = useCurrencyFormatter();
  const groupedTransactions = groupTransactions({
    groupBy,
    sortGroupsBy,
    transactions,
  });
  return (
    <>
      {groupedTransactions?.map((group) => (
        <>
          <GroupHeadings>
            <h4>{group.key}</h4>
            <p>{format(group.total)}</p>
          </GroupHeadings>
          <List>
            {group.transactions.map((transaction) => (
              <Item key={transaction.id}>
                <Transaction
                  isDateVisible
                  isFilteringEnabled
                  transaction={transaction}
                />
              </Item>
            ))}
          </List>
        </>
      ))}
    </>
  );
};

const GroupHeadings = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  margin-top: 48px;

  h4 {
    margin: 0;
  }

  p {
    margin: 0;
  }
`;

export default Transactions;
