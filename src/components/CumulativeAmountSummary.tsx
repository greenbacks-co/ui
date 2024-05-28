import React, { useContext, useState } from 'react';

import { Button, ButtonStyle } from 'components/Button';
import { Icon, IconType } from 'components/Icon';
import { Alignment, JustifiedRow, Space } from 'components/JustifiedRow';
import List, { Item } from 'components/List';
import LoadingIndicator from 'components/LoadingIndicator';
import { PureMonthSelector as MonthSelector } from 'components/MonthSelector';
import { Panel, PanelItem } from 'components/Panel';
import { PureSpendingTimeline as SpendingTimeline } from 'components/SpendingTimeline';
import { Size, Text } from 'components/Text';
import Transaction from 'components/Transaction';
import { UserSettingsContext } from 'context/UserSettings';
import useCurrencyFormatter from 'hooks/useCurrencyFormatter';
import useNow from 'hooks/useNow';
import { useQueryParams } from 'hooks/useQueryParams';
import useSpendingByDayOfMonth from 'hooks/useSpendingByDayOfMonth';
import useTransactionsByCategory from 'hooks/useTransactionsByCategory';
import type TransactionType from 'types/transaction';
import datetime from 'utils/datetime';
import {
  GroupBy,
  groupTransactions,
  SortGroupsBy,
  SortTransactionsBy,
} from 'utils/groupTransactions';
import noop from 'utils/noop';

export function CumulativeAmountSummary({
  areAllTagsVisible = false,
  comparisonSpendingByDate = {},
  endDate,
  expandedTag,
  hasMonthSelector = false,
  isCurrentMonth = false,
  isLoading = false,
  month,
  onChangeMonth = noop,
  onChangeVisibleTagCount = noop,
  onSelectTag = noop,
  startDate,
  transactions = [],
  visibleTagCount = 5,
}: {
  areAllTagsVisible?: boolean;
  comparisonSpendingByDate?: Record<string, number>;
  endDate?: datetime;
  expandedTag?: string;
  hasMonthSelector?: boolean;
  isCurrentMonth?: boolean;
  isLoading?: boolean;
  month?: datetime;
  onChangeMonth?: (input: datetime) => void;
  onChangeVisibleTagCount?: (input: number) => void;
  onSelectTag?: (input: string | undefined) => void;
  startDate?: datetime;
  transactions?: TransactionType[];
  visibleTagCount?: number;
}): React.ReactElement {
  const { format } = useCurrencyFormatter();
  const totalSpending = getTotalSpending({ transactions });
  const groupedTransactions =
    groupTransactions({
      groupBy: GroupBy.Tag,
      sortGroupsBy: SortGroupsBy.Total,
      sortTransactionsBy: SortTransactionsBy.Amount,
      transactions,
    }) ?? [];
  const tagCutoffIndex = areAllTagsVisible
    ? groupedTransactions.length
    : visibleTagCount;
  const visibleTagAmounts = groupedTransactions.slice(0, tagCutoffIndex);
  const remainingTagAmounts = groupedTransactions.slice(tagCutoffIndex);
  const remainingSpendingAmount = remainingTagAmounts.reduce(
    (totalSoFar, group) => totalSoFar + group.total,
    0
  );
  const remainingTransactions = remainingTagAmounts
    .flatMap((group) => group.transactions)
    .sort((a, b) => (a.amount > b.amount ? -1 : 1));
  const canIncreaseVisibleTagCount =
    groupedTransactions.length > visibleTagCount;
  const actualVisibleTagCount = Math.min(
    visibleTagCount,
    groupedTransactions.length
  );
  const canDecreaseVisibleTagCount = actualVisibleTagCount > 1;
  if (isLoading)
    return (
      <Panel>
        <PanelItem hasBottomBorder>
          <Text size={Size.Small}>
            {getSpendingPeriodText({
              endDate,
              isCurrentMonth,
              month,
              startDate,
            })}
          </Text>
          <Text size={Size.Large}>--</Text>
        </PanelItem>
        <PanelItem>
          <JustifiedRow alignment={Alignment.Center}>
            <LoadingIndicator />
          </JustifiedRow>
        </PanelItem>
      </Panel>
    );
  return (
    <Panel>
      <PanelItem hasBottomBorder={visibleTagAmounts.length > 0}>
        <Text size={Size.Small}>
          {getSpendingPeriodText({ endDate, isCurrentMonth, month, startDate })}
        </Text>
        <Text size={Size.Large}>{format(totalSpending)}</Text>
      </PanelItem>
      <PanelItem hasBottomBorder>
        <SpendingTimeline
          comparisonLabel="average"
          comparisonSpendingByDate={comparisonSpendingByDate}
          hasLastActualReferenceLine={false}
          hasLastPredictedReferenceLine={false}
          endDate={endDate}
          startDate={startDate}
          transactions={transactions}
        />
      </PanelItem>
      {hasMonthSelector && month && (
        <PanelItem hasBottomBorder>
          <MonthSelector
            month={month}
            onClickPrevious={() =>
              onChangeMonth(month.minus({ months: 1 }).startOf('month'))
            }
            onClickNext={() =>
              onChangeMonth(month.plus({ months: 1 }).startOf('month'))
            }
          />
        </PanelItem>
      )}
      {visibleTagAmounts.length > 0 && (
        <List
          hasOutsideBorder={false}
          hasRoundedBottomCorners
          hasRoundedTopCorners={false}
        >
          {visibleTagAmounts.map(
            ({ key: tag, total, transactions: visibleTransactions }, index) => {
              const isExpanded = tag === expandedTag;
              return (
                <TagAmount
                  isExpanded={isExpanded}
                  isFirstTag={index === 0}
                  isLastTag={index === groupedTransactions.length - 1}
                  onExpand={() => {
                    const tagToReport = isExpanded ? undefined : tag;
                    onSelectTag(tagToReport);
                  }}
                  key={tag}
                  tag={tag}
                  total={total}
                  transactions={visibleTransactions}
                />
              );
            }
          )}
          {remainingSpendingAmount > 0 && (
            <TagAmount
              isExpanded={expandedTag === 'other'}
              onExpand={() => {
                const tagToReport =
                  expandedTag === 'other' ? undefined : 'other';
                onSelectTag(tagToReport);
              }}
              tag="All other transactions"
              total={remainingSpendingAmount}
              transactions={remainingTransactions}
            />
          )}
          <Item>
            <JustifiedRow>
              <Text size={Size.Small}>
                {actualVisibleTagCount} of {groupedTransactions.length} tag
                {groupedTransactions.length !== 1 && 's'} visible
              </Text>
              <JustifiedRow space={Space.Small}>
                {canIncreaseVisibleTagCount && (
                  <Button
                    isDisabled={!canIncreaseVisibleTagCount}
                    onClick={() => {
                      onChangeVisibleTagCount(visibleTagCount + 1);
                    }}
                    style={ButtonStyle.Unstyled}
                  >
                    <Icon icon={IconType.Plus} />
                  </Button>
                )}
                {canDecreaseVisibleTagCount && (
                  <Button
                    onClick={() => {
                      const currentTagCount = Math.min(
                        visibleTagCount,
                        visibleTagAmounts.length
                      );
                      const newTagCount = Math.max(currentTagCount - 1, 1);
                      onChangeVisibleTagCount(newTagCount);
                    }}
                    style={ButtonStyle.Unstyled}
                  >
                    <Icon icon={IconType.Minus} />
                  </Button>
                )}
              </JustifiedRow>
            </JustifiedRow>
          </Item>
        </List>
      )}
    </Panel>
  );
}

function getTotalSpending({
  transactions,
}: {
  transactions: TransactionType[];
}): number {
  return transactions.reduce(
    (total, transaction) => total + transaction.amount,
    0
  );
}

function TagAmount({
  isExpanded = false,
  isFirstTag = false,
  isLastTag = false,
  onExpand = noop,
  tag,
  total,
  transactions = [],
}: {
  isExpanded?: boolean;
  isFirstTag?: boolean;
  isLastTag?: boolean;
  onExpand?: () => void;
  tag: string;
  total: number;
  transactions?: TransactionType[];
}): React.ReactElement {
  const { format } = useCurrencyFormatter();
  if (!isExpanded)
    return (
      <Item>
        <Button isFullWidth onClick={onExpand} style={ButtonStyle.Unstyled}>
          <JustifiedRow>
            <Text>{format(total)}</Text>
            <Text isUnderlined size={Size.Small}>
              {tag}
            </Text>
          </JustifiedRow>
        </Button>
      </Item>
    );
  return (
    <Panel hasBorder={false} hasTopBorder={!isFirstTag}>
      <PanelItem>
        <Button isFullWidth onClick={onExpand} style={ButtonStyle.Unstyled}>
          <JustifiedRow>
            <Text isBold>{format(total)}</Text>
            <Text isBold isUnderlined size={Size.Small}>
              {tag}
            </Text>
          </JustifiedRow>
        </Button>
      </PanelItem>
      <List
        hasOutsideBorder={false}
        hasRoundedBottomCorners={isLastTag}
        hasRoundedTopCorners={false}
        isIndented
        isInset
      >
        {transactions.map((transaction) => (
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

function getSpendingPeriodText({
  endDate,
  isCurrentMonth = false,
  month,
  startDate,
}: {
  endDate?: datetime;
  isCurrentMonth?: boolean;
  month?: datetime;
  startDate?: datetime;
}): string | undefined {
  if (isCurrentMonth) return "This month you've spent";
  if (month)
    return `In ${month.toLocaleString({
      month: 'long',
      year: 'numeric',
    })} you spent`;
  if (startDate && !endDate)
    return `Since ${startDate.toLocaleString(datetime.DATE_FULL)} you've spent`;
  if (startDate && endDate)
    return `Between ${startDate.toLocaleString(
      datetime.DATE_MED
    )} and ${endDate.toLocaleString(datetime.DATE_MED)} you spent`;
  return undefined;
}

export function CumulativeAmountSummaryContainer(): React.ReactElement {
  const { isTestData } = useContext(UserSettingsContext);
  const { now } = useNow();
  const { params, setParams } = useQueryParams();
  const visibleMonth = params.month
    ? datetime.fromISO(params.month)
    : now.startOf('month');
  const {
    isLoading: isLoadingCumulativeTransactions,
    spending: currentMonthSpending,
  } = useTransactionsByCategory({
    endDate: visibleMonth.endOf('month').toISODate(),
    isTestData,
    startDate: visibleMonth.startOf('month').toISODate(),
  });
  const {
    isLoading: isLoadingComparisonPeriod,
    spending: previousYearSpendingByDayOfMonth,
  } = useSpendingByDayOfMonth({
    endDate: now.minus({ months: 1 }).endOf('month').toISODate(),
    isTestData,
    startDate: now.minus({ years: 1 }).startOf('month').toISODate(),
  });
  const [expandedTag, setExpandedTag] = useState<string | undefined>(undefined);
  const [visibleTagCount, setVisibleTagCount] = useState<number>(5);

  const comparisonSpendingByDate = Object.entries(
    previousYearSpendingByDayOfMonth ?? {}
  ).reduce((result, [day, spending]) => {
    const date = visibleMonth.set({ day: parseInt(day, 10) }).toISODate();
    return { ...result, [date]: spending / 12 };
  }, {});

  return (
    <CumulativeAmountSummary
      comparisonSpendingByDate={comparisonSpendingByDate}
      endDate={visibleMonth.endOf('month')}
      expandedTag={expandedTag}
      hasMonthSelector
      isCurrentMonth={
        visibleMonth.toFormat('yyyy-LL') === now.toFormat('yyyy-LL')
      }
      isLoading={isLoadingCumulativeTransactions || isLoadingComparisonPeriod}
      month={visibleMonth}
      onChangeMonth={(newMonth) =>
        setParams({ month: newMonth.toFormat('yyyy-LL') })
      }
      onChangeVisibleTagCount={setVisibleTagCount}
      onSelectTag={(tag) => setExpandedTag(tag)}
      startDate={visibleMonth.startOf('month')}
      transactions={currentMonthSpending}
      visibleTagCount={visibleTagCount}
    />
  );
}
