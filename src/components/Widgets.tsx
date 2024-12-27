import React, { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import AccountConnectionBarrier from 'components/AccountConnectionBarrier';
import AverageSpendingByTag from 'components/AverageSpendingByTag';
import CashFlow from 'components/CashFlow';
import Home from 'components/Home';
import MonthlySpendingByTag from 'components/MonthlySpendingByTag';
import Select from 'components/Select';
import Spending from 'components/Spending';
import SpendingTimeline from 'components/SpendingTimeline';
import TopSpendingCategories from 'components/TopSpendingCategories';
import TotalsByMonth from 'components/TotalsByMonth';
import TransactionsPage from 'components/TransactionsPage';
import UntaggedTransactions from 'components/UntaggedTransactions';

export function Widgets(): React.ReactElement {
  const [page, setPage] = useState<string>('');
  const navigate = useNavigate();
  const options = [
    { label: 'Old Home', value: 'old-home' },
    { label: 'Old Spending', value: 'old-spending' },
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
    { label: 'Filters', value: 'filters' },
  ];

  const oldHome = (
    <AccountConnectionBarrier>
      <Home />
    </AccountConnectionBarrier>
  );

  const oldSpending = (
    <AccountConnectionBarrier>
      <Spending />
    </AccountConnectionBarrier>
  );

  return (
    <>
      <Select
        id="page-selector"
        onChange={(newPage) => {
          setPage(newPage);
          navigate(newPage);
        }}
        options={options}
        value={page}
      />
      <Routes>
        <Route path="/" element={oldHome} />
        <Route path="/old-home" element={oldHome} />
        <Route path="/months/:month/" element={oldHome} />
        <Route path="/old-spending" element={oldSpending} />
        <Route path="/spending" element={oldSpending} />
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
}
