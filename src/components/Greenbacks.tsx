import React, { FC, useContext } from 'react';
import { Route, Routes } from 'react-router-dom';

import { NoAccountsBarrierContainer as NoAccountsBarrier } from 'components/NoAccounts';
import { SpendingSummary } from 'components/SpendingSummaryPage';
import TagModalContext, { TagModalProvider } from 'context/TagModal';
import useAddFilter from 'hooks/useAddFilter';
import Filters from './pages/Filters';
import { NewFilterModalContainer } from './organisms/FilterModal';
import { AccountsContainer as Accounts } from './pages/Accounts';
import { Widgets } from './pages/Widgets';
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
