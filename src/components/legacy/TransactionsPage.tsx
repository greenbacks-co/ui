import React, { FC, useState } from 'react';

import Select from 'components/Select';
import TransactionSelector from 'components/TransactionSelector';
import useCategories from 'hooks/useCategories';
import useMonth from 'hooks/useMonth';
import useSelectedFilters from 'hooks/useSelectedFilters';
import useTransactionsByCategory from 'hooks/useTransactionsByCategory';
import Transaction, { Category } from 'types/transaction';
import { GroupBy, SortGroupsBy } from 'utils/groupTransactions';
import Transactions from './Transactions';
import MonthSelector from '../organisms/MonthSelector';

const TransactionsPage: FC = () => {
  const categories = useCategories();
  const { endDate, startDate } = useMonth();
  const { earning, isLoading, saving, spending } = useTransactionsByCategory({
    endDate,
    startDate,
  });
  const { earningTags, savingTags, spendingTags } = findTagsByCategory({
    earning,
    saving,
    spending,
  });
  const {
    onChangeSelectedCategories,
    onChangeSelectedEarningTags,
    onChangeSelectedSavingTags,
    onChangeSelectedSpendingTags,
    selectedCategories,
    selectedEarningTags,
    selectedSavingTags,
    selectedSpendingTags,
  } = useSelectedFilters({
    selectableCategories: categories,
    selectableEarningTags: earningTags,
    selectableSavingTags: savingTags,
    selectableSpendingTags: spendingTags,
  });
  const [groupBy, setGroupBy] = useState<GroupBy>(GroupBy.Date);
  if (isLoading) return <p>loading</p>;
  const {
    earning: selectedEarning,
    saving: selectedSaving,
    spending: selectedSpending,
  } = filterTransactions({
    earning,
    saving,
    spending,
    selectedCategories,
    selectedEarningTags,
    selectedSavingTags,
    selectedSpendingTags,
  });
  return (
    <>
      <h2>Transactions</h2>
      <MonthSelector />
      <TransactionSelector
        onChangeSelectedCategories={onChangeSelectedCategories}
        onChangeSelectedEarningTags={onChangeSelectedEarningTags}
        onChangeSelectedSavingTags={onChangeSelectedSavingTags}
        onChangeSelectedSpendingTags={onChangeSelectedSpendingTags}
        selectableCategories={categories}
        selectableEarningTags={earningTags}
        selectableSpendingTags={spendingTags}
        selectableSavingTags={savingTags}
        selectedCategories={selectedCategories}
        selectedEarningTags={selectedEarningTags}
        selectedSavingTags={selectedSavingTags}
        selectedSpendingTags={selectedSpendingTags}
      />
      <Select
        id="group-by"
        onChange={(newGroupBy) => {
          setGroupBy(GroupBy[newGroupBy as keyof typeof GroupBy]);
        }}
        options={Object.values(GroupBy).map((option) => option.toString())}
        value={groupBy.toString()}
      />
      <Transactions
        groupBy={groupBy}
        sortGroupsBy={
          groupBy === GroupBy.Date ? SortGroupsBy.Key : SortGroupsBy.Total
        }
        transactions={
          [
            ...(selectedEarning ?? []),
            ...(selectedSaving ?? []),
            ...(selectedSpending ?? []),
          ] || []
        }
      />
    </>
  );
};

function findTagsByCategory({
  earning = [],
  saving = [],
  spending = [],
}: {
  earning?: Transaction[];
  saving?: Transaction[];
  spending?: Transaction[];
}): {
  earningTags: string[];
  savingTags: string[];
  spendingTags: string[];
} {
  return {
    earningTags: findTags({ transactions: earning }),
    savingTags: findTags({ transactions: saving }),
    spendingTags: findTags({ transactions: spending }),
  };
}

function findTags({
  transactions = [],
}: {
  transactions?: Transaction[];
}): string[] {
  if (!transactions) return [];
  return Object.keys(
    transactions.reduce(
      (tags: Record<string, string>, transaction: Transaction) => ({
        ...tags,
        [transaction.tag || 'Untagged']: '',
      }),
      {},
    ),
  ).sort();
}

function filterTransactions({
  earning,
  saving,
  spending,
  selectedCategories = [],
  selectedEarningTags = [],
  selectedSavingTags = [],
  selectedSpendingTags = [],
}: {
  earning?: Transaction[];
  saving?: Transaction[];
  spending?: Transaction[];
  selectedCategories?: Category[];
  selectedEarningTags?: string[];
  selectedSavingTags?: string[];
  selectedSpendingTags?: string[];
}): {
  earning?: Transaction[];
  saving?: Transaction[];
  spending?: Transaction[];
} {
  const selectedTransactions: {
    earning?: Transaction[];
    saving?: Transaction[];
    spending?: Transaction[];
  } = {};
  if (earning && selectedCategories.includes(Category.Earning)) {
    selectedTransactions.earning = earning.filter((transaction) =>
      selectedEarningTags.includes(transaction.tag || 'Untagged'),
    );
  }
  if (saving && selectedCategories.includes(Category.Saving)) {
    selectedTransactions.saving = saving.filter((transaction) =>
      selectedSavingTags.includes(transaction.tag || 'Untagged'),
    );
  }
  if (spending && selectedCategories.includes(Category.Spending)) {
    selectedTransactions.spending = spending.filter((transaction) =>
      selectedSpendingTags.includes(transaction.tag || 'Untagged'),
    );
  }
  return selectedTransactions;
}

export default TransactionsPage;
