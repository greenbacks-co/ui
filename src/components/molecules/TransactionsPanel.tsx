import React, { ReactElement } from 'react';
import TransactionType from 'types/transaction';
import { Placeholder } from 'components/atoms/Placeholder';
import Transaction from './Transaction';
import List, { Item } from '../atoms/List';
import { Panel, PanelItem } from '../atoms/Panel';
import { Text } from '../atoms/Text';

export function TransactionsPanel({
  loading = false,
  title = 'Transactions',
  transactions = [],
}: {
  loading?: boolean;
  title?: string;
  transactions?: TransactionType[];
}): ReactElement {
  if (loading)
    return (
      <Panel>
        <PanelItem hasBottomBorder>
          <Text>Transactions</Text>
        </PanelItem>
        <Placeholder loading />
      </Panel>
    );
  if (!transactions || transactions.length === 0)
    return (
      <Panel>
        <PanelItem hasBottomBorder>
          <Text>Transactions</Text>
        </PanelItem>
        <Placeholder>No Transactions</Placeholder>
      </Panel>
    );
  const sortedTransactions = transactions.sort((a, b) =>
    a.amount > b.amount ? -1 : 1,
  );
  return (
    <Panel>
      <PanelItem hasBottomBorder>
        <Text>{title}</Text>
      </PanelItem>
      <List
        hasOutsideBorder={false}
        hasRoundedBottomCorners
        hasRoundedTopCorners={false}
      >
        {sortedTransactions.map((transaction) => (
          <Item key={transaction.id}>
            <Transaction
              isCompact
              isFilteringEnabled
              transaction={transaction}
            />
          </Item>
        ))}
      </List>
    </Panel>
  );
}
