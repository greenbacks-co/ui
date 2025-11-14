import React, { FC } from 'react';

import SectionContainer from 'components/SectionContainer';
import useCurrencyFormatter from 'hooks/useCurrencyFormatter';
import useMonth from 'hooks/useMonth';
import useTotalEarning from 'hooks/useTotalEarning';
import useTotalSaving from 'hooks/useTotalSaving';
import useTotalSpending from 'hooks/useTotalSpending';
import CashFlowGraph from './CashFlowGraph';
import LoadingIndicator from '../atoms/LoadingIndicator';

const MonthlyOverview: FC = () => {
  const { endDate, startDate } = useMonth();
  const { format } = useCurrencyFormatter();
  const { isLoading: isLoadingTotalEarning, totalEarning } = useTotalEarning({
    endDate,
    startDate,
  });
  const { isLoading: isLoadingTotalSaving, totalSaving } = useTotalSaving({
    endDate,
    startDate,
  });
  const { isLoading: isLoadingTotalSpending, totalSpending } = useTotalSpending(
    { endDate, startDate },
  );
  const isLoading =
    isLoadingTotalEarning || isLoadingTotalSaving || isLoadingTotalSpending;

  if (isLoading)
    return (
      <SectionContainer id="monthly-overview" title="Monthly Overview">
        <LoadingIndicator name="monthly-overview" />
      </SectionContainer>
    );

  return (
    <SectionContainer id="monthly-overview" title="Monthly Overview">
      <CashFlowGraph
        earning={totalEarning}
        idPrefix="monthly"
        saving={totalSaving}
        spending={totalSpending}
      />
      <p>
        Total Earning:&nbsp;
        {format({ value: totalEarning })}
      </p>
      <p>
        Total Spending:&nbsp;
        {format({ value: totalSpending })}
      </p>
      <p>
        Total Saving:&nbsp;
        {format({ value: totalSaving })}
      </p>
      <p>
        Savings Rate:&nbsp;
        {`${getSavingsRate({ totalEarning, totalSaving })}%`}
      </p>
    </SectionContainer>
  );
};

const getSavingsRate = ({
  totalEarning,
  totalSaving,
}: {
  totalEarning?: number;
  totalSaving?: number;
}): number => {
  if (!totalEarning) return 0;
  if (!totalSaving) return 0;
  return Math.round((totalSaving / totalEarning) * 100);
};

export default MonthlyOverview;
