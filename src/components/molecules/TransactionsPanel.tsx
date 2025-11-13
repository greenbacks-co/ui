import Transaction from 'components/Transaction';
import React, { ReactElement, useState } from 'react';
import TransactionType from 'types/transaction';
import LoadingIndicator from '../atoms/LoadingIndicator';
import Icon, { IconType } from '../atoms/Icon';
import List, { Item } from '../atoms/List';
import { Panel, PanelItem } from '../atoms/Panel';
import { Alignment, Row } from '../atoms/Row';
import { Size, Text } from '../atoms/Text';
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
          <Row alignment={Alignment.Center}>
            <LoadingIndicator />
          </Row>
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
        <Row>
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
        </Row>
      </PanelItem>
    </Panel>
  );
}
