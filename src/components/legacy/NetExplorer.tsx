import React from 'react';

import useCurrencyFormatter from 'hooks/useCurrencyFormatter';
import useMonth from 'hooks/useMonth';
import { useQueryParams } from 'hooks/useQueryParams';
import useTransactions from 'hooks/useTransactions';
import type Transaction from 'types/transaction';
import {
  GroupBy,
  groupTransactions,
  SortGroupsBy,
  SortTransactionsBy,
} from 'utils/groupTransactions';
import noop from 'utils/noop';
import LoadingIndicator from '../atoms/LoadingIndicator';
import { Icon, IconType } from '../atoms/Icon';
import List, { Item as ListItem } from '../atoms/List';
import { Panel, PanelItem } from '../atoms/Panel';
import { Alignment, Row } from '../atoms/Row';
import { Size, Text } from '../atoms/Text';
import { Button, ButtonStyle } from '../atoms/Button';

export function NetExplorer({
  isLoading = false,
  onChangeTagVisibility = noop,
  onClickNext = noop,
  onClickPrevious = noop,
  period,
  tags = {},
  tagVisibility = {},
  total = 0,
}: {
  isLoading?: boolean;
  onChangeTagVisibility?: (input: Record<string, boolean>) => void;
  onClickNext?: () => void;
  onClickPrevious?: () => void;
  period?: string;
  tags?: Record<string, number>;
  tagVisibility?: Record<string, boolean>;
  total?: number;
}): React.ReactElement {
  const { format } = useCurrencyFormatter();
  const tagNames = Object.keys(tags);
  if (isLoading) {
    return (
      <Panel>
        <PanelItem hasBottomBorder={tagNames.length > 0}>
          <Text size={Size.Large}>{format(total)}</Text>
        </PanelItem>
        {period && (
          <PanelItem hasBottomBorder>
            <Row>
              <Button onClick={onClickPrevious} style={ButtonStyle.Unstyled}>
                <Icon icon={IconType.ChevronLeft} />
              </Button>
              <Text>{period}</Text>
              <Button onClick={onClickNext} style={ButtonStyle.Unstyled}>
                <Icon icon={IconType.ChevronRight} />
              </Button>
            </Row>
          </PanelItem>
        )}
        <PanelItem>
          <Row alignment={Alignment.Center}>
            <LoadingIndicator />
          </Row>
        </PanelItem>
      </Panel>
    );
  }
  return (
    <Panel>
      <PanelItem hasBottomBorder={tagNames.length > 0}>
        <Text size={Size.Large}>{format(total)}</Text>
      </PanelItem>
      {period && (
        <PanelItem hasBottomBorder>
          <Row>
            <Button onClick={onClickPrevious} style={ButtonStyle.Unstyled}>
              <Icon icon={IconType.ChevronLeft} />
            </Button>
            <Text>{period}</Text>
            <Button onClick={onClickNext} style={ButtonStyle.Unstyled}>
              <Icon icon={IconType.ChevronRight} />
            </Button>
          </Row>
        </PanelItem>
      )}
      <List hasOutsideBorder={false}>
        {tagNames.map((name) => (
          <ListItem isInset={!tagVisibility[name]} key={name}>
            <Button
              isFullWidth
              onClick={() =>
                onChangeTagVisibility({
                  ...tagVisibility,
                  [name]: !tagVisibility[name],
                })
              }
              style={ButtonStyle.Unstyled}
            >
              <Row>
                <Text size={Size.Small}>{name}</Text>
                <Text size={Size.Small}>{format(tags[name])}</Text>
              </Row>
            </Button>
          </ListItem>
        ))}
      </List>
    </Panel>
  );
}

export function NetExplorerMonthContainer(): React.ReactElement {
  const {
    endDate,
    nextMonth,
    previousMonth,
    readable: readableMonth,
    startDate,
  } = useMonth();
  const { setParams } = useQueryParams();
  const {
    credits = [],
    debits = [],
    isLoading,
  } = useTransactions({
    endDate,
    startDate,
  });
  const [tagVisibility, setTagVisibility] = React.useState<
    Record<string, boolean>
  >({});
  const tags = getTags([
    ...credits,
    ...debits.map((debit) => ({ ...debit, amount: -1 * debit.amount })),
  ]);
  const total = getTotal({ tags, tagVisibility });
  return (
    <NetExplorer
      isLoading={isLoading}
      onChangeTagVisibility={(newTagVisibility) =>
        setTagVisibility(newTagVisibility)
      }
      onClickNext={() => setParams({ month: nextMonth })}
      onClickPrevious={() => setParams({ month: previousMonth })}
      period={readableMonth}
      tags={tags}
      tagVisibility={tagVisibility}
      total={total}
    />
  );
}

function getTags(transactions: Transaction[] = []): Record<string, number> {
  const tagGroups =
    groupTransactions({
      groupBy: GroupBy.Tag,
      sortGroupsBy: SortGroupsBy.Total,
      sortTransactionsBy: SortTransactionsBy.Amount,
      transactions,
    }) ?? [];
  const tags = tagGroups.reduce(
    (result, tag) => ({
      ...result,
      [tag?.key ?? '']: tag?.total ?? 0,
    }),
    {},
  );
  return tags;
}

function getTotal({
  tags = {},
  tagVisibility = {},
}: {
  tags?: Record<string, number>;
  tagVisibility: Record<string, boolean>;
}): number {
  const visibleTagNames = Object.entries(tagVisibility)
    .filter((tagVisibilityItem) => tagVisibilityItem[1])
    .map(([tag]) => tag);
  const total = visibleTagNames.reduce(
    (result, tag) => result + tags[tag] ?? 0,
    0,
  );
  return total;
}
