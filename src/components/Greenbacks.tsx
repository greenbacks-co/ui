import React, { FC, useContext, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import AccountConnectionBarrier from 'components/AccountConnectionBarrier';
import Accounts from 'components/Accounts';
import CashFlow from 'components/CashFlow';
import AverageSpendingByTag from 'components/AverageSpendingByTag';
import Button from 'components/Button';
import Home from 'components/Home';
import Link from 'components/Link';
import LoadingIndicator from 'components/LoadingIndicator';
import MonthlySpendingByTag from 'components/MonthlySpendingByTag';
import SpendingTimeline from 'components/SpendingTimeline';
import Select from 'components/Select';
import Spending from 'components/Spending';
import TagModal from 'components/TagModal';
import TopSpendingCategories from 'components/TopSpendingCategories';
import TotalsByMonth from 'components/TotalsByMonth';
import TransactionsPage from 'components/TransactionsPage';
import UntaggedTransactions from 'components/UntaggedTransactions';
import TagModalContext, { TagModalProvider } from 'context/TagModal';
import useIsApiReady from 'hooks/useIsApiReady';
import useIsAuthenticated from 'hooks/useIsAuthenticated';
import useLogin from 'hooks/useLogin';
import useLogout from 'hooks/useLogout';

const Greenbacks: FC = () => (
  <TagModalProvider>
    <GreenbacksInContext />
  </TagModalProvider>
);

const GreenbacksInContext: FC = () => {
  const { transactionToTag } = useContext(TagModalContext);
  const { isReady: isApiReady } = useIsApiReady();
  const { isAuthenticated } = useIsAuthenticated();
  const { login } = useLogin();
  const { logout } = useLogout();
  const navigate = useNavigate();
  const [page, setPage] = useState<string>('');

  if (!isAuthenticated) return <Button onClick={login}>Login</Button>;

  if (!isApiReady) return <LoadingIndicator />;

  const home = (
    <AccountConnectionBarrier>
      <Home />
    </AccountConnectionBarrier>
  );

  const spending = (
    <AccountConnectionBarrier>
      <Spending />
    </AccountConnectionBarrier>
  );

  const options = [
    {
      label: 'Totals by Month',
      value: 'totals-by-month',
    },
    {
      label: 'Spending Timeline',
      value: 'spending-timeline',
    },
    {
      label: 'Transactions',
      value: 'transactions',
    },
    {
      label: 'Monthly Spending by Tag',
      value: 'monthly-spending-by-tag',
    },
  ];

  return (
    <>
      <ul>
        <li>
          <Link href="/">Greenbacks</Link>
        </li>
        <li>
          <Link href="/accounts">Accounts</Link>
        </li>
        <li>
          <Link href="/spending">Spending</Link>
        </li>
        <li>
          <Button onClick={logout}>Logout</Button>
        </li>
      </ul>
      <Select
        id="page-selector"
        onChange={(newPage) => {
          setPage(newPage);
          navigate(`/${newPage}`);
        }}
        options={options}
        value={page}
      />
      {transactionToTag !== undefined && <TagModal />}
      <Routes>
        <Route path="/" element={home} />
        <Route path="/months/:month/" element={home} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/spending" element={spending} />
        <Route path="/cashflow" element={<CashFlow />} />
        <Route
          path="/average-spending-by-tag"
          element={<AverageSpendingByTag />}
        />
        <Route
          path="/untagged-transactions"
          element={<UntaggedTransactions />}
        />
        <Route path="/totals-by-month" element={<TotalsByMonth />} />
        <Route path="/spending-timeline" element={<SpendingTimeline />} />
        <Route
          path="/monthly-spending-by-tag/:month"
          element={<MonthlySpendingByTag />}
        />
        <Route
          path="/monthly-spending-by-tag"
          element={<MonthlySpendingByTag />}
        />
        <Route
          path="/top-spending-categories/:month"
          element={<TopSpendingCategories />}
        />
        <Route
          path="/top-spending-categories"
          element={<TopSpendingCategories />}
        />
        <Route path="/transactions" element={<TransactionsPage />} />
      </Routes>
    </>
  );
};

export default Greenbacks;
