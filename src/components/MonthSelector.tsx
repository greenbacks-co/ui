import { DateTime } from 'luxon';
import React, { ReactElement, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import { Button, ButtonStyle } from 'components/Button';
import { Icon, IconType } from 'components/Icon';
import Link from 'components/Link';
import { Panel, PanelItem } from 'components/Panel';
import { Text } from 'components/Text';
import useMonth from 'hooks/useMonth';
import noop from 'utils/noop';
import styled from 'utils/styled';

export function MonthSelector({
  area,
  month,
  nextUrl,
  onClickNext = noop,
  onClickPrevious = noop,
  previousUrl,
}: {
  area?: string;
  month: DateTime;
  nextUrl?: string;
  onClickNext?: () => void;
  onClickPrevious?: () => void;
  previousUrl?: string;
}): ReactElement {
  return (
    <Wrapper $area={area}>
      <LinkButton href={previousUrl} onClick={onClickPrevious}>
        <Icon icon={IconType.ChevronLeft} />
      </LinkButton>
      <Text>{month.toLocaleString({ month: 'long', year: 'numeric' })}</Text>
      <LinkButton href={nextUrl} onClick={onClickNext}>
        <Icon icon={IconType.ChevronRight} />
      </LinkButton>
    </Wrapper>
  );
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
}: {
  area?: string;
  month: DateTime;
  nextUrl?: string;
  onClickNext?: () => void;
  onClickPrevious?: () => void;
  previousUrl?: string;
}): ReactElement {
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
