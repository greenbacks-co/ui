import React, { ReactElement, useState } from 'react';
import styled from 'styled-components';

import { Icon, IconType } from 'components/Icon';
import { JustifiedRow } from 'components/JustifiedRow';
import useTransactionsByCategory from 'hooks/useTransactionsByCategory';
import Transaction from 'types/transaction';
import groupTransactions, { GroupBy } from 'utils/groupTransactions';
import { Variability } from 'types/variability';
import useNow from 'hooks/useNow';
import Checkboxes from './Checkboxes';
import { Month, TotalsByMonth, Series, SERIES_ORDER } from './NewTotalsByMonth';
import noop from '../utils/noop';
import { Panel, PanelItem } from './Panel';
import Button, { ButtonStyle } from './Button';
import { Modal } from './Modal';
import { Text } from './Text';

export function TotalsByMonthGroup({
  area,
  areCheckboxesVisible = false,
  monthTotals,
  onChangeCheckboxVisibility = noop,
  onChangeVisibilityBySeries = noop,
  visibilityBySeries = {},
}: {
  area?: string;
  areCheckboxesVisible?: boolean;
  monthTotals?: Month[];
  onChangeCheckboxVisibility?: (input: boolean) => void;
  onChangeVisibilityBySeries?: (
    input: Partial<Record<Series, boolean>>,
  ) => void;
  visibilityBySeries?: Partial<Record<Series, boolean>>;
}): ReactElement {
  return (
    <>
      {areCheckboxesVisible && (
        <Modal
          onClose={() => onChangeCheckboxVisibility(false)}
          title="Visibility"
        >
          <Checkboxes
            hasButtons={false}
            onChange={(selectedSeries) =>
              onChangeVisibilityBySeries(
                selectedSeries.reduce(
                  (result, series) => ({
                    ...result,
                    [series]: true,
                  }),
                  {},
                ),
              )
            }
            options={SERIES_OPTIONS}
            selectedOptions={Object.keys(visibilityBySeries).filter(
              (series) => visibilityBySeries[series as Series],
            )}
          />
        </Modal>
      )}
      <Wrapper $area={area}>
        <Panel>
          <PanelItem hasBottomBorder>
            <JustifiedRow>
              <Text>Cashflow</Text>
              <Button
                onClick={() => onChangeCheckboxVisibility(true)}
                style={ButtonStyle.Unstyled}
              >
                <Icon icon={IconType.Filter} />
              </Button>
            </JustifiedRow>
          </PanelItem>
          <PanelItem>
            <TotalsByMonth
              coloursBySeries={COLOURS_BY_SERIES}
              labelsBySeries={LABELS_BY_SERIES}
              monthTotals={monthTotals}
              visibilityBySeries={visibilityBySeries}
            />
          </PanelItem>
        </Panel>
      </Wrapper>
    </>
  );
}

const COLOURS_BY_SERIES: Partial<Record<Series, string>> = {
  [Series.AfterFixedSpending]: 'darkorange',
  [Series.AfterSaving]: 'lightgreen',
  [Series.AfterVariableSpending]: 'pink',
  [Series.Earning]: 'darkgreen',
  [Series.FixedSpending]: 'orange',
  [Series.Saving]: 'blue',
  [Series.Spending]: 'red',
  [Series.VariableSpending]: 'gold',
};

const LABELS_BY_SERIES: Partial<Record<Series, string>> = {
  [Series.AfterFixedSpending]: 'Balance After Bills',
  [Series.AfterSaving]: 'Balance After Saving',
  [Series.AfterVariableSpending]: 'Final Balance',
  [Series.Earning]: 'Earning',
  [Series.FixedSpending]: 'Bills',
  [Series.Saving]: 'Saving',
  [Series.Spending]: 'Spending',
  [Series.VariableSpending]: 'Fun',
};

const SERIES_OPTIONS = SERIES_ORDER.map((series) => ({
  label: LABELS_BY_SERIES[series] ?? series,
  value: series,
}));

const Wrapper = styled.div<{ $area?: string }>`
  ${({ $area }) => $area && `grid-area: ${$area};`}
  width: 100%;
`;

export function TotalsByMonthGroupSelectionContainer({
  area,
  monthTotals,
}: {
  area?: string;
  monthTotals?: Month[];
}): ReactElement {
  const [areCheckboxesVisible, setAreCheckboxesVisible] =
    useState<boolean>(false);
  const [visibilityBySeries, setVisibilityBySeries] = useState<
    Partial<Record<Series, boolean>>
  >({});
  return (
    <TotalsByMonthGroup
      area={area}
      areCheckboxesVisible={areCheckboxesVisible}
      monthTotals={monthTotals}
      onChangeCheckboxVisibility={(newVisibility) =>
        setAreCheckboxesVisible(newVisibility)
      }
      onChangeVisibilityBySeries={setVisibilityBySeries}
      visibilityBySeries={visibilityBySeries}
    />
  );
}

export function TotalsByMonthGroupTransactionContainer({
  area,
  endDate,
  startDate,
}: {
  area?: string;
  endDate: string;
  startDate: string;
}): ReactElement {
  const { earning, saving, spending } = useTransactionsByCategory({
    endDate,
    startDate,
  });
  const monthTotals = getMonthTotals({ earning, saving, spending });
  return (
    <TotalsByMonthGroupSelectionContainer
      area={area}
      monthTotals={monthTotals}
    />
  );
}

function getMonthTotals({
  earning = [],
  saving = [],
  spending = [],
}: {
  earning?: Transaction[];
  saving?: Transaction[];
  spending?: Transaction[];
}): Month[] {
  const spendingGroups =
    groupTransactions({
      groupBy: GroupBy.Variability,
      transactions: spending,
    }) ?? [];
  const fixedSpending =
    spendingGroups.find((group) => group.key === Variability.Fixed)
      ?.transactions ?? [];
  const variableSpending =
    spendingGroups.find((group) => group.key === Variability.Variable)
      ?.transactions ?? [];
  const earningByMonth = groupTransactions({
    groupBy: GroupBy.Month,
    transactions: earning,
  });
  const savingByMonth = groupTransactions({
    groupBy: GroupBy.Month,
    transactions: saving,
  });
  const fixedSpendingByMonth = groupTransactions({
    groupBy: GroupBy.Month,
    transactions: fixedSpending,
  });
  const variableSpendingByMonth = groupTransactions({
    groupBy: GroupBy.Month,
    transactions: variableSpending,
  });
  console.log({
    earningByMonth,
    savingByMonth,
    fixedSpendingByMonth,
    variableSpendingByMonth,
  });
  const totalsByMonth: Record<string, Month> = {};
  earningByMonth?.forEach((month) => {
    const totalsSoFar = totalsByMonth[month.key] ?? {};
    totalsByMonth[month.key] = {
      ...totalsSoFar,
      earning: month.total,
      month: month.key,
    };
  });
  savingByMonth?.forEach((month) => {
    const totalsSoFar = totalsByMonth[month.key] ?? {};
    totalsByMonth[month.key] = {
      ...totalsSoFar,
      saving: month.total,
      month: month.key,
    };
  });
  fixedSpendingByMonth?.forEach((month) => {
    const totalsSoFar = totalsByMonth[month.key] ?? {};
    totalsByMonth[month.key] = {
      ...totalsSoFar,
      fixedSpending: month.total,
      month: month.key,
    };
  });
  variableSpendingByMonth?.forEach((month) => {
    const totalsSoFar = totalsByMonth[month.key] ?? {};
    totalsByMonth[month.key] = {
      ...totalsSoFar,
      variableSpending: month.total,
      month: month.key,
    };
  });
  const result = Object.values(totalsByMonth)
    .sort((a, b) => (a.month > b.month ? 1 : -1))
    .map((month) => {
      const afterSaving = (month.earning ?? 0) - (month.saving ?? 0);
      const afterFixedSpending = afterSaving - (month.fixedSpending ?? 0);
      const afterVariableSpending =
        afterFixedSpending - (month.variableSpending ?? 0);
      return {
        ...month,
        afterFixedSpending,
        afterSaving,
        afterVariableSpending,
      };
    });
  return result;
}

export function TotalsByMonthGroupContainer({
  area,
}: {
  area?: string;
}): ReactElement {
  const { now } = useNow();
  return (
    <TotalsByMonthGroupTransactionContainer
      area={area}
      endDate={now.minus({ months: 1 }).endOf('month').toISODate()}
      startDate={now.minus({ months: 12 }).startOf('month').toISODate()}
    />
  );
}
