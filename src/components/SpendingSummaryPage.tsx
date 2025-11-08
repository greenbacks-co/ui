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
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
