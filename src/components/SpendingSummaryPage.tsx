import React from 'react';
import styled from 'styled-components';

import { AverageAmountSummaryContainer } from 'components/AverageAmountSummary';
import { CumulativeAmountSummaryContainer } from 'components/CumulativeAmountSummary';
import MonthSelector from 'components/MonthSelector';
import { TotalsByMonthPanelContainer as TotalsByMonth } from './NewTotalsByMonth';
import { CashflowTimelinePanelContainer } from './CashflowTimelinePanel';
import { UntaggedTransactionsContainer } from './NewUntaggedTransactions';
import { CashflowRowContainer } from './organisms/CashflowRow';

export function SpendingSummary(): React.ReactElement {
  return (
    <Wrapper>
      <TotalsByMonth area="totals" />
      <MonthSelector area="month" />
      <CashflowRowContainer />
      <CashflowTimelinePanelContainer />
      <UntaggedTransactionsContainer />
      <CumulativeAmountSummaryContainer />
      <AverageAmountSummaryContainer />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: grid;
  grid-gap: 32px;
  grid-template-areas:
    'totals'
    'average'
    'cumulative';
  grid-template-columns: 1fr;

  @media (min-width: 632px) {
    grid-gap: 16px;
    grid-template-areas:
      'totals  totals'
      'month   month'
      'row     row'
      'average cumulative';
    grid-template-columns: 1fr 1fr;
  }
`;
