import { DateTime } from 'luxon';
import React, { useContext, useState } from 'react';

import { Icon, IconType } from 'components/Icon';
import List, { Item } from 'components/List';
import LoadingIndicator from 'components/LoadingIndicator';
import { MonthlyAmountsGraph } from 'components/MonthlyAmountsGraph';
import { Panel, PanelItem } from 'components/Panel';
import { UserSettingsContext } from 'context/UserSettings';
import useCurrencyFormatter from 'hooks/useCurrencyFormatter';
import useNow from 'hooks/useNow';
import useTransactionsByCategory from 'hooks/useTransactionsByCategory';
import Transaction from 'types/transaction';
import {
  Group,
  GroupBy,
  groupTransactions,
  SortGroupsBy,
} from 'utils/groupTransactions';
import noop from 'utils/noop';
import { Alignment, Row, Space } from './atoms/Row';
import { Size, Text } from './atoms/Text';
import { Button, ButtonStyle } from './atoms/Button';

export function AverageAmountSummary({
  endDate,
  expandedTag,
  isLoading = false,
  onChangeVisibleTagCount = noop,
  onSelectTag = noop,
  startDate,
  transactions = [],
  visibleTagCount = 5,
}: {
  endDate?: DateTime;
  expandedTag?: string;
  isLoading?: boolean;
  onChangeVisibleTagCount?: (input: number) => void;
  onSelectTag?: (input: string | undefined) => void;
  startDate?: DateTime;
  transactions?: Transaction[];
  visibleTagCount?: number;
} = {}): React.ReactElement {
  const { format } = useCurrencyFormatter();
  const transactionsByMonth = groupTransactions({
    groupBy: GroupBy.Month,
    transactions,
  });
  if (!transactionsByMonth) return <div>empty</div>;
  const graphData = formatGroupsForGraph({
    groups: transactionsByMonth,
    seriesName: 'Spending',
  });
  const averageMonthlySpending =
    transactionsByMonth.reduce((result, group) => result + group.total, 0) /
    transactionsByMonth.length;
  const transactionsByTag = groupTransactions({
    groupBy: GroupBy.Tag,
    sortGroupsBy: SortGroupsBy.Total,
    transactions,
  });
  const transactionsByTagAndMonth = transactionsByTag?.map<{
    average: number;
    tag: string;
    transactionsByMonth: Group[];
  }>((group) => {
    const tagTransactionsByMonth = groupTransactions({
      groupBy: GroupBy.Month,
      transactions: group.transactions,
    });
    return {
      average: group.total / transactionsByMonth.length,
      tag: group.key,
      transactionsByMonth: tagTransactionsByMonth ?? [],
    };
  });
  const allTags = Object.keys(transactionsByTag ?? {});
  const visibleTransactionGroups =
    transactionsByTagAndMonth?.slice(0, visibleTagCount) ?? [];
  const remainingTagsGroup = combineRemainingTags(
    transactionsByTagAndMonth?.slice(visibleTagCount, allTags.length) ?? [],
  );
  if (isLoading)
    return (
      <Panel>
        <PanelItem hasBottomBorder>
          <Text size={Size.Small}>On average each month you&apos;ve spent</Text>
          <Text size={Size.Large}>--</Text>
        </PanelItem>
        <PanelItem>
          <Row alignment={Alignment.Center}>
            <LoadingIndicator />
          </Row>
        </PanelItem>
      </Panel>
    );
  return (
    <Panel>
      <PanelItem hasBottomBorder>
        <Text size={Size.Small}>On average each month you&apos;ve spent</Text>
        <Text size={Size.Large}>{format(averageMonthlySpending)}</Text>
      </PanelItem>
      <PanelItem hasBottomBorder>
        <MonthlyAmountsGraph
          endDate={endDate}
          hasLegend={false}
          monthCount={transactionsByMonth.length}
          monthlyAmountsBySeriesName={graphData}
          startDate={startDate}
        />
      </PanelItem>
      {startDate && endDate && (
        <PanelItem hasBottomBorder>
          <Row alignment={Alignment.Center}>
            <Text>{`${startDate?.toLocaleString({
              month: 'short',
              year: 'numeric',
            })} – ${endDate?.toLocaleString({
              month: 'short',
              year: 'numeric',
            })}`}</Text>
          </Row>
        </PanelItem>
      )}
      <List
        hasOutsideBorder={false}
        hasRoundedBottomCorners
        hasRoundedTopCorners={false}
      >
        {visibleTransactionGroups &&
          visibleTransactionGroups.map(
            ({ average, tag, transactionsByMonth: transactionGroups }) => (
              <ExpandableTagAmount
                amount={average}
                endDate={endDate}
                isExpanded={expandedTag === tag}
                key={tag}
                onCollapse={() => onSelectTag(undefined)}
                onExpand={() => onSelectTag(tag)}
                startDate={startDate}
                tag={tag}
                transactionsByMonth={transactionGroups}
              />
            ),
          )}
        {remainingTagsGroup.average > 0 && (
          <ExpandableTagAmount
            amount={remainingTagsGroup.average}
            endDate={endDate}
            isExpanded={expandedTag === 'all-other-transactions'}
            onCollapse={() => onSelectTag(undefined)}
            onExpand={() => onSelectTag('all-other-transactions')}
            startDate={startDate}
            tag="All other transactions"
            transactionsByMonth={remainingTagsGroup.transactionsByMonth}
          />
        )}
        <Item>
          <TagVisibilityController
            onChangeVisibleTagCount={onChangeVisibleTagCount}
            totalTagCount={allTags.length}
            visibleTagCount={visibleTagCount}
          />
        </Item>
      </List>
    </Panel>
  );
}

function formatGroupsForGraph({
  groups,
  seriesName,
}: {
  groups: Group[];
  seriesName: string;
}) {
  return {
    [seriesName]: groups
      .map((group) => ({
        amount: group.total,
        month: DateTime.fromISO(group.key),
      }))
      .sort((a, b) => (a.month > b.month ? 1 : -1)),
  };
}

function combineRemainingTags(
  remainingGroups: Array<{
    average: number;
    tag: string;
    transactionsByMonth: Group[];
  }>,
): { average: number; tag: string; transactionsByMonth: Group[] } {
  const totalAmount = remainingGroups.reduce(
    (sum, group) => sum + group.average,
    0,
  );
  const allTransactions = remainingGroups.flatMap((group) =>
    group.transactionsByMonth.flatMap((monthGroup) => monthGroup.transactions),
  );
  const regroupedTransactions = groupTransactions({
    groupBy: GroupBy.Month,
    transactions: allTransactions,
  });
  return {
    average: totalAmount,
    tag: 'All other transactions',
    transactionsByMonth: regroupedTransactions || [],
  };
}

function ExpandableTagAmount({
  amount,
  endDate,
  isExpanded = false,
  onCollapse = noop,
  onExpand = noop,
  startDate,
  tag,
  transactionsByMonth = [],
}: {
  amount: number;
  endDate?: DateTime;
  isExpanded?: boolean;
  onCollapse?: () => void;
  onExpand?: () => void;
  startDate?: DateTime;
  tag: string;
  transactionsByMonth?: Group[];
}): React.ReactElement {
  const formattedGroups = formatGroupsForGraph({
    groups: transactionsByMonth,
    seriesName: tag,
  });
  if (!isExpanded)
    return (
      <Item>
        <ExpandableTagAmountHeader
          amount={amount}
          isExpanded={isExpanded}
          onClick={onExpand}
          tag={tag}
        />
      </Item>
    );
  return (
    <Item hasPadding={false}>
      <Panel hasBorder={false}>
        <PanelItem hasBottomBorder>
          <ExpandableTagAmountHeader
            amount={amount}
            isExpanded={isExpanded}
            onClick={onCollapse}
            tag={tag}
          />
        </PanelItem>
        <PanelItem isInset>
          <MonthlyAmountsGraph
            endDate={endDate}
            hasLegend={false}
            monthlyAmountsBySeriesName={formattedGroups}
            startDate={startDate}
          />
        </PanelItem>
      </Panel>
    </Item>
  );
}

function ExpandableTagAmountHeader({
  amount,
  isExpanded = false,
  onClick = noop,
  tag,
}: {
  amount: number;
  isExpanded?: boolean;
  onClick?: () => void;
  tag: string;
}): React.ReactElement {
  const { format } = useCurrencyFormatter();
  return (
    <Button isFullWidth onClick={onClick} style={ButtonStyle.Unstyled}>
      <Row>
        <Text isBold={isExpanded}>{format(amount)}</Text>
        <Text isBold={isExpanded} isUnderlined size={Size.Small}>
          {tag}
        </Text>
      </Row>
    </Button>
  );
}

function TagVisibilityController({
  onChangeVisibleTagCount = noop,
  totalTagCount,
  visibleTagCount,
}: {
  onChangeVisibleTagCount?: (input: number) => void;
  totalTagCount: number;
  visibleTagCount: number;
}): React.ReactElement {
  const actualVisibleTagCount = Math.max(
    Math.min(visibleTagCount, totalTagCount),
    1,
  );
  const canIncreaseVisibleTagCount = totalTagCount > actualVisibleTagCount;
  const canDecreaseVisibleTagCount = actualVisibleTagCount > 1;
  return (
    <Row>
      <Text size={Size.Small}>
        {actualVisibleTagCount} of {totalTagCount} tags visible
      </Text>
      <Row space={Space.Small}>
        {canIncreaseVisibleTagCount && (
          <Button
            isDisabled={!canIncreaseVisibleTagCount}
            onClick={() => {
              onChangeVisibleTagCount(actualVisibleTagCount + 1);
            }}
            style={ButtonStyle.Unstyled}
          >
            <Icon icon={IconType.Plus} />
          </Button>
        )}
        {canDecreaseVisibleTagCount && (
          <Button
            onClick={() => {
              onChangeVisibleTagCount(actualVisibleTagCount - 1);
            }}
            style={ButtonStyle.Unstyled}
          >
            <Icon icon={IconType.Minus} />
          </Button>
        )}
      </Row>
    </Row>
  );
}

export function AverageAmountSummaryContainer(): React.ReactElement {
  const { isTestData } = useContext(UserSettingsContext);
  const { now } = useNow();
  const [visibleTagCount, onChangeVisibleTagCount] = useState<number>(5);
  const [expandedTag, onSelectTag] = useState<string | undefined>();
  const endDate = now.minus({ months: 1 }).endOf('month');
  const startDate = now.minus({ years: 1 }).startOf('month');
  const { isLoading, spending } = useTransactionsByCategory({
    endDate: endDate.toISODate(),
    isTestData,
    startDate: startDate.toISODate(),
  });
  return (
    <AverageAmountSummary
      endDate={endDate}
      expandedTag={expandedTag}
      isLoading={isLoading}
      onChangeVisibleTagCount={onChangeVisibleTagCount}
      onSelectTag={onSelectTag}
      startDate={startDate}
      transactions={spending}
      visibleTagCount={visibleTagCount}
    />
  );
}
