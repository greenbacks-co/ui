import useCurrencyFormatter from 'hooks/useCurrencyFormatter';
import useTransactionsByCategory from 'hooks/useTransactionsByCategory';
import React, { ReactElement, useState } from 'react';
import TransactionType from 'types/transaction';
import noop from 'utils/noop';

import useNow from '../hooks/useNow';
import groupTransactions, {
  GroupBy,
  SortTransactionsBy,
} from '../utils/groupTransactions';
import Button, { ButtonStyle } from './atoms/Button';
import Icon, { IconType } from './atoms/Icon';
import { Alignment, Row } from './atoms/Row';
import List, { Item } from './atoms/List';
import LoadingIndicator from './atoms/LoadingIndicator';
import { Panel, PanelItem } from './atoms/Panel';
import { Size, Text } from './atoms/Text';
import Transaction from './Transaction';

export function UntaggedTransactions({
  currentIndex = 0,
  isLoading = false,
  onClickNext = noop,
  onClickPrevious = noop,
  totalAmount,
  totalCount,
  untaggedTransactions = [],
}: {
  currentIndex?: number;
  isLoading?: boolean;
  onClickPrevious?: () => void;
  onClickNext?: () => void;
  totalAmount?: number;
  totalCount?: number;
  untaggedTransactions?: TransactionType[];
}): ReactElement {
  const { format } = useCurrencyFormatter();
  if (isLoading)
    return (
      <Panel>
        <PanelItem hasBottomBorder>
          <Text>Untagged Transactions</Text>
        </PanelItem>
        <PanelItem>
          <Row alignment={Alignment.Center}>
            <LoadingIndicator />
          </Row>
        </PanelItem>
      </Panel>
    );
  const rangeText = `${currentIndex + 1}–${currentIndex + untaggedTransactions.length}`;
  const footerText = totalCount ? `${rangeText} of ${totalCount}` : rangeText;
  return (
    <Panel>
      <PanelItem hasBottomBorder>
        <Text>
          Untagged Transactions
          {totalAmount && ` (${format({ value: totalAmount })})`}
        </Text>
      </PanelItem>
      <List
        hasOutsideBorder={false}
        hasRoundedBottomCorners
        hasRoundedTopCorners={false}
      >
        {untaggedTransactions.map((transaction) => (
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
            isDisabled={currentIndex < 0}
            onClick={onClickPrevious}
            style={ButtonStyle.Unstyled}
          >
            <Icon icon={IconType.ChevronLeft} />
          </Button>
          <Text size={Size.Small}>{footerText}</Text>
          <Button
            isDisabled={
              totalCount
                ? currentIndex + untaggedTransactions.length > totalCount
                : false
            }
            onClick={onClickNext}
            style={ButtonStyle.Unstyled}
          >
            <Icon icon={IconType.ChevronRight} />
          </Button>
        </Row>
      </PanelItem>
    </Panel>
  );
}

export function UntaggedTransactionsContainer(): ReactElement {
  const {
    isLoading,
    totalAmount,
    untaggedTransactions = [],
  } = useUntaggedTransactions();
  const { currentIndex, onNext, onPrevious, visibleTransactions } =
    useVisibleTransactions({
      transactions: untaggedTransactions,
    });
  return (
    <UntaggedTransactions
      currentIndex={currentIndex}
      isLoading={isLoading}
      onClickNext={onNext}
      onClickPrevious={onPrevious}
      totalAmount={totalAmount}
      totalCount={untaggedTransactions.length}
      untaggedTransactions={visibleTransactions}
    />
  );
}

function useUntaggedTransactions(): {
  isLoading?: boolean;
  totalAmount?: number;
  untaggedTransactions?: TransactionType[];
} {
  const { now } = useNow();
  const endDate = now.endOf('month').toISODate();
  const startDate = now.minus({ months: 12 }).startOf('month').toISODate();
  const {
    earning = [],
    saving = [],
    spending = [],
    isLoading,
  } = useTransactionsByCategory({
    endDate,
    startDate,
  });
  const groups = groupTransactions({
    groupBy: GroupBy.Tag,
    sortTransactionsBy: SortTransactionsBy.Amount,
    transactions: [...earning, ...saving, ...spending],
  });
  const untaggedTransactionsGroup = groups?.find(
    (group) => group.key === 'Untagged',
  );
  const untaggedTransactions = untaggedTransactionsGroup?.transactions ?? [];
  return {
    isLoading,
    totalAmount: untaggedTransactionsGroup?.total,
    untaggedTransactions,
  };
}

function useVisibleTransactions({
  transactions = [],
}: {
  transactions?: TransactionType[];
}): {
  currentIndex: number;
  onNext: () => void;
  onPrevious: () => void;
  visibleTransactions?: TransactionType[];
} {
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleTransactions = transactions.slice(
    currentIndex,
    currentIndex + PAGE_SIZE,
  );
  return {
    currentIndex,
    onNext: () => {
      setCurrentIndex(currentIndex + PAGE_SIZE);
    },
    onPrevious: () => {
      setCurrentIndex(Math.max(currentIndex - PAGE_SIZE, 0));
    },
    visibleTransactions,
  };
}

const PAGE_SIZE = 10;
