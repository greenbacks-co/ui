import Icon, { IconType } from 'components/Icon';
import { Alignment, JustifiedRow } from 'components/JustifiedRow';
import List, { Item } from 'components/List';
import LoadingIndicator from 'components/LoadingIndicator';
import { Panel, PanelItem } from 'components/Panel';
import { Size, Text } from 'components/Text';
import Transaction from 'components/Transaction';
import React, { ReactElement, useState } from 'react';
import TransactionType from 'types/transaction';
import Button, { ButtonStyle } from '../atoms/Button';

const PAGE_SIZE = 10;

export function TransactionsPanel({
  isLoading = false,
  title = 'Transactions',
  transactions = [],
}: {
  isLoading?: boolean;
  title?: string;
  transactions?: TransactionType[];
}): ReactElement {
  const [page, setPage] = useState(0);
  if (isLoading)
    return (
      <Panel>
        <PanelItem hasBottomBorder>
          <Text>Transactions</Text>
        </PanelItem>
        <PanelItem>
          <JustifiedRow alignment={Alignment.Center}>
            <LoadingIndicator />
          </JustifiedRow>
        </PanelItem>
      </Panel>
    );
  const sortedTransactions = transactions.sort((a, b) =>
    a.amount > b.amount ? -1 : 1,
  );
  const visibleTransactions = sortedTransactions.slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE,
  );
  const rangeText = `${page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, transactions.length)}`;
  const footerText = `${rangeText} of ${transactions.length}`;
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
        {visibleTransactions.map((transaction) => (
          <Item key={transaction.id}>
            <Transaction
              isCompact
              isFilteringEnabled
              transaction={transaction}
            />
          </Item>
        ))}
      </List>
      <PanelItem hasTopBorder>
        <JustifiedRow>
          <Button
            isDisabled={page < 1}
            onClick={() => setPage(page - 1)}
            style={ButtonStyle.Unstyled}
          >
            <Icon icon={IconType.ChevronLeft} />
          </Button>
          <Text size={Size.Small}>{footerText}</Text>
          <Button
            isDisabled={(page + 1) * PAGE_SIZE > transactions.length}
            onClick={() => setPage(page + 1)}
            style={ButtonStyle.Unstyled}
          >
            <Icon icon={IconType.ChevronRight} />
          </Button>
        </JustifiedRow>
      </PanelItem>
    </Panel>
  );
}
