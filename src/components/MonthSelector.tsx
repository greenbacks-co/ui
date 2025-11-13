import { DateTime } from 'luxon';
import React, { ReactElement, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import { Icon, IconType } from 'components/Icon';
import Link from 'components/Link';
import useMonth from 'hooks/useMonth';
import noop from 'utils/noop';
import styled from 'utils/styled';
import useNow from 'hooks/useNow';
import getMonth from 'utils/getMonth';
import { Panel, PanelItem } from './atoms/Panel';
import { Text } from './atoms/Text';
import { Button, ButtonStyle } from './atoms/Button';

export function MonthSelector({
  area,
  hasNext = true,
  hasPrevious = true,
  month,
  nextUrl,
  onClickNext = noop,
  onClickPrevious = noop,
  previousUrl,
}: MonthSelectorProps): ReactElement {
  return (
    <Wrapper $area={area}>
      {hasPrevious ? (
        <LinkButton href={previousUrl} onClick={onClickPrevious}>
          <Icon icon={IconType.ChevronLeft} />
        </LinkButton>
      ) : (
        <div />
      )}
      <Text>{month.toLocaleString({ month: 'long', year: 'numeric' })}</Text>
      {hasNext ? (
        <LinkButton href={nextUrl} onClick={onClickNext}>
          <Icon icon={IconType.ChevronRight} />
        </LinkButton>
      ) : (
        <div />
      )}
    </Wrapper>
  );
}

interface MonthSelectorProps {
  area?: string;
  hasNext?: boolean;
  hasPrevious?: boolean;
  month: DateTime;
  nextUrl?: string;
  onClickNext?: () => void;
  onClickPrevious?: () => void;
  previousUrl?: string;
}

function LinkButton({
  children,
  href,
  onClick = noop,
}: {
  children?: ReactNode;
  href?: string;
  onClick?: () => void;
}): ReactElement {
  if (href) return <Link href={href}>{children}</Link>;
  return (
    <Button onClick={onClick} style={ButtonStyle.Unstyled}>
      {children}
    </Button>
  );
}

export function MonthSelectorPanel({
  area,
  ...props
}: MonthSelectorProps): ReactElement {
  return (
    <Panel area={area}>
      <PanelItem>
        <MonthSelector {...props} />
      </PanelItem>
    </Panel>
  );
}

export function QueryParameterMonthSelector({
  area,
}: {
  area?: string;
}): ReactElement {
  const { nextMonth, previousMonth, iso } = useMonth();
  const { now } = useNow();
  const { iso: currentMonth } = getMonth({ datetime: now });
  const { pathname, search } = useLocation();
  const previousMonthUrl = `${pathname}?${addQueryParam(
    search,
    'month',
    previousMonth,
  )}`;
  const nextMonthUrl = `${pathname}?${addQueryParam(
    search,
    'month',
    nextMonth,
  )}`;
  return (
    <MonthSelectorPanel
      area={area}
      month={DateTime.fromISO(iso)}
      hasNext={iso !== currentMonth}
      nextUrl={nextMonthUrl}
      previousUrl={previousMonthUrl}
    />
  );
}

export { MonthSelector as PureMonthSelector };

function addQueryParam(
  currentParams: string,
  newKey: string,
  newValue: string,
): string {
  const queryParams = new URLSearchParams(currentParams);
  queryParams.set(newKey, newValue);
  return queryParams.toString();
}

const Wrapper = styled.div<{ $area?: string }>`
  align-items: baseline;
  display: flex;
  ${({ $area }) => $area && `grid-area: ${$area};`}
  justify-content: space-between;
`;

export default QueryParameterMonthSelector;
