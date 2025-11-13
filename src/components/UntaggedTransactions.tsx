import React, { FC } from 'react';

import SectionContainer from 'components/SectionContainer';
import Transactions from 'components/Transactions';
import useAveragingPeriod from 'hooks/useAveragingPeriod';
import useNow from 'hooks/useNow';
import useUntaggedTransactions from 'hooks/useUntaggedTransactions';
import LoadingIndicator from './atoms/LoadingIndicator';

const UntaggedTransactions: FC = () => {
  const { startIso: startDate } = useAveragingPeriod();
  const { now } = useNow();
  const {
    earning: credits,
    isLoading,
    spending: debits,
  } = useUntaggedTransactions({
    endDate: now.toFormat('yyyy-LL-dd'),
    startDate,
  });

  if (isLoading) return <LoadingIndicator />;

  return (
    <>
      {credits && (
        <SectionContainer
          id="untagged-credits"
          isCollapsible
          title={`Untagged Credits (${credits?.length})`}
        >
          <Transactions transactions={credits || []} />
        </SectionContainer>
      )}
      {debits && (
        <SectionContainer
          id="untagged-debits"
          isCollapsible
          title={`Untagged Debits (${debits?.length})`}
        >
          <Transactions transactions={debits || []} />
        </SectionContainer>
      )}
    </>
  );
};

export default UntaggedTransactions;
