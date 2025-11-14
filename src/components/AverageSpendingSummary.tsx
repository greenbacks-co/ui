import React, { FC } from 'react';

import useAverageMonthlySpending from 'hooks/useAverageMonthlySpending';
import useCurrencyFormatter from 'hooks/useCurrencyFormatter';
import useSpendingRate from 'hooks/useSpendingRate';
import Link from './atoms/Link';
import LoadingIndicator from './atoms/LoadingIndicator';

const AverageSpendingSummary: FC<{ hasLinkToSpendingPage?: boolean }> = ({
  hasLinkToSpendingPage = false,
}) => {
  const { averageMonthlySpending, isLoading: isLoadingAverageSpending } =
    useAverageMonthlySpending();
  const { spendingRate, isLoading: isLoadingSpendingRate } = useSpendingRate();
  const { format } = useCurrencyFormatter();

  const isLoading = isLoadingAverageSpending || isLoadingSpendingRate;

  if (isLoading) return <LoadingIndicator name="average-monthly-spending" />;

  return (
    <>
      <p>
        {getText({
          formattedAmount: format({ value: averageMonthlySpending }),
          rate: spendingRate,
        })}
      </p>
      {hasLinkToSpendingPage && <Link href="/spending">Explore spending</Link>}
    </>
  );
};

const getText = ({
  formattedAmount,
  rate,
}: {
  formattedAmount: string;
  rate?: number;
}) => {
  const amountText = `You spend ${formattedAmount} per month on average`;
  if (!rate) return amountText;
  const formattedRate = `${Math.round((rate || 0) * 100)}%`;
  const rateText = `(${formattedRate} of earning)`;
  return `${amountText} ${rateText}`;
};

export default AverageSpendingSummary;
