import React from 'react';
import styled from 'styled-components';

import { AverageAmountSummaryContainer } from 'components/AverageAmountSummary';
import { CumulativeAmountSummaryContainer } from 'components/CumulativeAmountSummary';
import { TotalsByMonthPanelContainer as TotalsByMonth } from './NewTotalsByMonth';

export function SpendingSummary(): React.ReactElement {
  return (
    <Wrapper>
      <TotalsByMonth area="totals" />
      <AverageAmountSummaryContainer />
      <CumulativeAmountSummaryContainer />
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
      'average cumulative';
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 832px) {
    width: 800px;
  }
`;
