import React, { FC, useContext } from 'react';
import { Route, Routes } from 'react-router-dom';

import { AccountsContainer as Accounts } from 'components/Accounts';
import Filters from 'components/Filters';
import { NewFilterModalContainer } from 'components/NewFilterModal';
import { NoAccountsBarrierContainer as NoAccountsBarrier } from 'components/NoAccounts';
import { SpendingSummary } from 'components/SpendingSummaryPage';
import { Widgets } from 'components/Widgets';
import TagModalContext, { TagModalProvider } from 'context/TagModal';
import useAddFilter from 'hooks/useAddFilter';
import { PageContainer } from './molecules/Page';

function Greenbacks(): React.ReactElement {
  return (
    <TagModalProvider>
      <GreenbacksInContext />
    </TagModalProvider>
  );
}

const GreenbacksInContext: FC = () => {
  const { closeModal, transactionToTag } = useContext(TagModalContext);
  const { addFilter } = useAddFilter();

  return (
    <PageContainer>
      {transactionToTag !== undefined && (
        <NewFilterModalContainer
          onClose={closeModal}
          onSave={(filter) => {
            addFilter({ filter });
            closeModal();
          }}
          transaction={transactionToTag}
        />
      )}
      <Routes>
        <Route
          path="/"
          element={
            <NoAccountsBarrier>
              <SpendingSummary />
            </NoAccountsBarrier>
          }
        />
        <Route
          path="/widgets/*"
          element={
            <NoAccountsBarrier>
              <Widgets />
            </NoAccountsBarrier>
          }
        />
        <Route path="/accounts" element={<Accounts />} />
        <Route
          path="/filters"
          element={
            <NoAccountsBarrier>
              <Filters />
            </NoAccountsBarrier>
          }
        />
      </Routes>
    </PageContainer>
  );
};

export default Greenbacks;
