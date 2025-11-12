import { CashflowGuagePanel } from 'components/molecules/CashflowGuagePanel';
import { CategoryBreakdownPanel } from 'components/molecules/CategoryBreakdownPanel';
import { TransactionsPanel } from 'components/molecules/TransactionsPanel';
import useMonth from 'hooks/useMonth';
import useTransactionsByCategory from 'hooks/useTransactionsByCategory';
import React, { ReactElement, useState } from 'react';
import styled from 'styled-components';
import Transaction, { Category } from 'types/transaction';
import { Variability } from 'types/variability';
import datetime from 'utils/datetime';
import groupTransactions, { Group, GroupBy } from 'utils/groupTransactions';

export function CashflowRow({
  earning,
  projectedFixedEarning = 0,
  projectedFixedSpending = 0,
  saving,
  spending,
}: {
  earning?: Transaction[];
  projectedFixedEarning?: number;
  projectedFixedSpending?: number;
  saving?: Transaction[];
  spending?: Transaction[];
}): ReactElement {
  const {
    [Variability.Fixed]: fixedEarning,
    [Variability.Variable]: variableEarning,
  } = getVariabilityGroups(earning);
  const {
    [Variability.Fixed]: fixedSaving,
    [Variability.Variable]: variableSaving,
  } = getVariabilityGroups(saving);
  const {
    [Variability.Fixed]: fixedSpending,
    [Variability.Variable]: variableSpending,
  } = getVariabilityGroups(spending);
  const [category, setCategory] = useState<Category | undefined>();
  const [variability, setVariability] = useState<Variability | undefined>();
  const [tag, setTag] = useState<string | undefined>();
  const categoryToGroup = selectCategory({
    category,
    fixedEarning,
    fixedSaving,
    fixedSpending,
    variableEarning,
    variableSaving,
    variableSpending,
    variability,
  });
  const tags = groupTransactions({
    groupBy: GroupBy.Tag,
    transactions: categoryToGroup?.transactions,
  });
  const selectedTagGroup = tags?.find(({ key }) => key === tag);
  return (
    <Wrapper>
      <CashflowGuagePanel
        fixedEarning={fixedEarning?.total}
        fixedSaving={fixedSaving?.total}
        fixedSpending={fixedSpending?.total}
        projectedFixedEarning={projectedFixedEarning}
        projectedFixedSpending={projectedFixedSpending}
        variableEarning={variableEarning?.total}
        variableSaving={variableSaving?.total}
        variableSpending={variableSpending?.total}
        onSelect={({ category: newCategory, variability: newVariability }) => {
          setCategory(newCategory);
          setVariability(newVariability);
        }}
      />
      <CategoryBreakdownPanel
        category={category}
        onSelect={(newTag) => setTag(newTag)}
        tags={tags?.map(({ key, total }) => ({ name: key, total }))}
        variability={variability}
      />
      <TransactionsPanel
        title={tag}
        transactions={selectedTagGroup?.transactions}
      />
    </Wrapper>
  );
}

function getVariabilityGroups(
  transactions: Transaction[] | undefined,
): Partial<Record<Variability, Group>> {
  const groups = groupTransactions({
    groupBy: GroupBy.Variability,
    transactions,
  });
  return {
    [Variability.Fixed]: groups?.find(
      (group) => group.key === Variability.Fixed,
    ),
    [Variability.Variable]: groups?.find(
      (group) => group.key === Variability.Variable,
    ),
  };
}

function selectCategory({
  category,
  fixedEarning,
  fixedSaving,
  fixedSpending,
  variableEarning,
  variableSaving,
  variableSpending,
  variability,
}: {
  category?: Category;
  fixedEarning?: Group;
  fixedSaving?: Group;
  fixedSpending?: Group;
  variableEarning?: Group;
  variableSaving?: Group;
  variableSpending?: Group;
  variability?: Variability;
}): Group | undefined {
  if (category === Category.Earning && variability === Variability.Fixed)
    return fixedEarning;
  if (category === Category.Earning && variability === Variability.Variable)
    return variableEarning;
  if (category === Category.Saving && variability === Variability.Fixed)
    return fixedSaving;
  if (category === Category.Saving && variability === Variability.Variable)
    return variableSaving;
  if (category === Category.Spending && variability === Variability.Fixed)
    return fixedSpending;
  if (category === Category.Spending && variability === Variability.Variable)
    return variableSpending;
  return undefined;
}

const Wrapper = styled.div`
  display: grid;
  gap: 16px;

  @media (min-width: 820px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export function CashflowRowContainer(): ReactElement {
  const { isCurrent, endDate, startDate } = useMonth();
  const { earning, saving, spending } = useTransactionsByCategory({
    endDate,
    startDate,
  });
  const {
    fixedEarning: projectedFixedEarning,
    fixedSpending: projectedFixedSpending,
  } = useProjections();
  return (
    <CashflowRow
      earning={earning}
      projectedFixedEarning={isCurrent ? projectedFixedEarning : undefined}
      projectedFixedSpending={isCurrent ? projectedFixedSpending : undefined}
      saving={saving}
      spending={spending}
    />
  );
}

function useProjections(): {
  fixedEarning: number;
  fixedSpending: number;
} {
  const { iso } = useMonth();
  const startDate = datetime
    .fromISO(iso)
    .minus({ months: 3 })
    .startOf('month')
    .toISODate();
  const endDate = datetime
    .fromISO(iso)
    .minus({ months: 1 })
    .endOf('month')
    .toISODate();
  const { earning, spending } = useTransactionsByCategory({
    startDate,
    endDate,
  });
  const earningVariabilityGroups = groupTransactions({
    groupBy: GroupBy.Variability,
    transactions: earning,
  });
  const fixedEarning = earningVariabilityGroups?.find(
    ({ key }) => key === Variability.Fixed,
  );
  const totalFixedEarning = fixedEarning?.total ?? 0;
  const spendingVariabilityGroups = groupTransactions({
    groupBy: GroupBy.Variability,
    transactions: spending,
  });
  const fixedSpending = spendingVariabilityGroups?.find(
    ({ key }) => key === Variability.Fixed,
  );
  const totalFixedSpending = fixedSpending?.total ?? 0;
  return {
    fixedEarning: totalFixedEarning / 3,
    fixedSpending: totalFixedSpending / 3,
  };
}
