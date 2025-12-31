import { CashflowGuagePanel } from 'components/molecules/CashflowGuagePanel';
import { CategoryBreakdownPanel } from 'components/molecules/CategoryBreakdownPanel';
import { TransactionsPanel } from 'components/molecules/TransactionsPanel';
import {
  CategoryGroup,
  TagGroup,
  useCategorizedTransactions,
} from 'hooks/useCategorizedTransactions';
import useMonth from 'hooks/useMonth';
import React, { ReactElement, useState } from 'react';
import styled from 'styled-components';
import { Category } from 'types/transaction';
import { Variability } from 'types/variability';
import datetime from 'utils/datetime';

const MONTHS_TO_AVERAGE = 3;

export function CashflowRow({
  fixedEarning,
  fixedSaving,
  fixedSpending,
  loading = false,
  projectedFixedEarning = 0,
  projectedFixedSpending = 0,
  tagAverages = {},
  variableEarning,
  variableSaving,
  variableSpending,
}: {
  fixedEarning: CategoryGroup;
  fixedSaving: CategoryGroup;
  fixedSpending: CategoryGroup;
  loading?: boolean;
  projectedFixedEarning?: number;
  projectedFixedSpending?: number;
  tagAverages?: Partial<
    Record<Category, Partial<Record<Variability, Record<string, number>>>>
  >;
  variableEarning: CategoryGroup;
  variableSaving: CategoryGroup;
  variableSpending: CategoryGroup;
}): ReactElement {
  const [category, setCategory] = useState<Category | undefined>();
  const [variability, setVariability] = useState<Variability | undefined>();
  const [tag, setTag] = useState<string | undefined>();
  const selectedCategoryGroup = selectCategory({
    category,
    fixedEarning,
    fixedSaving,
    fixedSpending,
    variableEarning,
    variableSaving,
    variableSpending,
    variability,
  });
  const selectedTagGroup = selectedCategoryGroup?.tags?.find(
    ({ name }) => name === tag,
  );
  const selectedTagAverage =
    category && variability ? tagAverages[category]?.[variability] : {};
  return (
    <Wrapper>
      <CashflowGuagePanel
        fixedEarning={fixedEarning?.total}
        fixedSaving={fixedSaving?.total}
        fixedSpending={fixedSpending?.total}
        loading={loading}
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
        loading={loading}
        onSelect={(newTag) => setTag(newTag)}
        tags={selectedCategoryGroup?.tags}
        tagAverages={selectedTagAverage}
        variability={variability}
      />
      <TransactionsPanel
        loading={loading}
        title={selectedTagGroup ? tag : selectedCategoryGroup?.name}
        transactions={
          selectedTagGroup
            ? selectedTagGroup?.transactions
            : selectedCategoryGroup?.transactions
        }
      />
    </Wrapper>
  );
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
  fixedEarning?: CategoryGroup;
  fixedSaving?: CategoryGroup;
  fixedSpending?: CategoryGroup;
  variableEarning?: CategoryGroup;
  variableSaving?: CategoryGroup;
  variableSpending?: CategoryGroup;
  variability?: Variability;
}): CategoryGroup | undefined {
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
  const {
    fixedEarning,
    fixedSaving,
    fixedSpending,
    isLoading: loadingTransactions,
    variableEarning,
    variableSaving,
    variableSpending,
  } = useCategorizedTransactions({
    startDate: datetime.fromISO(startDate),
    endDate: datetime.fromISO(endDate),
  });
  const {
    fixedEarning: averageFixedEarning,
    fixedSaving: averageFixedSaving,
    fixedSpending: averageFixedSpending,
    isLoading: loadingAverages,
    variableEarning: averageVariableEarning,
    variableSaving: averageVariableSaving,
    variableSpending: averageVariableSpending,
  } = useCategorizedTransactions({
    startDate: datetime
      .fromISO(startDate)
      .minus({ months: MONTHS_TO_AVERAGE })
      .startOf('month'),
    endDate: datetime.fromISO(startDate).minus({ months: 1 }).endOf('month'),
  });
  const tagAverages = {
    [Category.Earning]: {
      [Variability.Fixed]: collectAverages(averageFixedEarning.tags),
      [Variability.Variable]: collectAverages(averageVariableEarning.tags),
    },
    [Category.Saving]: {
      [Variability.Fixed]: collectAverages(averageFixedSaving.tags),
      [Variability.Variable]: collectAverages(averageVariableSaving.tags),
    },
    [Category.Spending]: {
      [Variability.Fixed]: collectAverages(averageFixedSpending.tags),
      [Variability.Variable]: collectAverages(averageVariableSpending.tags),
    },
  };
  return (
    <CashflowRow
      fixedEarning={fixedEarning}
      fixedSaving={fixedSaving}
      fixedSpending={fixedSpending}
      loading={loadingTransactions || loadingAverages}
      projectedFixedEarning={
        isCurrent ? averageFixedEarning?.total / MONTHS_TO_AVERAGE : undefined
      }
      projectedFixedSpending={
        isCurrent ? averageFixedSpending?.total / MONTHS_TO_AVERAGE : undefined
      }
      tagAverages={tagAverages}
      variableEarning={variableEarning}
      variableSaving={variableSaving}
      variableSpending={variableSpending}
    />
  );
}

function collectAverages(tags: TagGroup[]): Record<string, number> {
  return tags.reduce(
    (result, tag) => ({
      ...result,
      [tag.name]: tag.total / MONTHS_TO_AVERAGE,
    }),
    {},
  );
}
