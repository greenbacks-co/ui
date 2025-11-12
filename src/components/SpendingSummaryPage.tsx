import React from 'react';
import styled from 'styled-components';

import MonthSelector from 'components/MonthSelector';
import { TotalsByMonthPanelContainer as TotalsByMonth } from './NewTotalsByMonth';
import { CashflowRowContainer } from './organisms/CashflowRow';

export function SpendingSummary(): React.ReactElement {
  return (
    <Wrapper>
      <TotalsByMonth area="totals" />
      <MonthSelector area="month" />
      <CashflowRowContainer />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
