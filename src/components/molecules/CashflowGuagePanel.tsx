import { CashflowGuage } from 'components/atoms/charts/CashflowGuage';
import { Panel, PanelItem } from 'components/Panel';
import useCurrencyFormatter from 'hooks/useCurrencyFormatter';
import React, { ReactElement } from 'react';
import { Category } from 'types/transaction';
import { Variability } from 'types/variability';
import noop from 'utils/noop';
import { Row } from '../atoms/Row';
import { Text } from '../atoms/Text';
import Button, { ButtonStyle } from '../atoms/Button';
import { CategoryLabel } from './CategoryLabel';

export function CashflowGuagePanel({
  fixedEarning = 0,
  fixedSaving = 0,
  fixedSpending = 0,
  onSelect = noop,
  projectedFixedEarning = 0,
  projectedFixedSpending = 0,
  variableEarning = 0,
  variableSaving = 0,
  variableSpending = 0,
}: {
  fixedEarning?: number;
  fixedSaving?: number;
  fixedSpending?: number;
  onSelect?: (input: { category: Category; variability: Variability }) => void;
  projectedFixedEarning?: number;
  projectedFixedSpending?: number;
  variableEarning?: number;
  variableSaving?: number;
  variableSpending?: number;
}): ReactElement {
  const { format } = useCurrencyFormatter();
  const { format: formatShort } = useCurrencyFormatter({ shorten: true });
  const remainingProjectedFixedEarning = Math.max(
    projectedFixedEarning - fixedEarning,
    0,
  );
  const remainingProjectedFixedSpending = Math.max(
    projectedFixedSpending - fixedSpending,
    0,
  );
  return (
    <Panel>
      <PanelItem hasBottomBorder>
        <Text>Cashflow</Text>
      </PanelItem>
      <PanelItem hasBottomBorder>
        <CashflowGuage
          fixedEarning={fixedEarning}
          fixedSaving={fixedSaving}
          fixedSpending={fixedSpending}
          projectedFixedEarning={projectedFixedEarning}
          projectedFixedSpending={projectedFixedSpending}
          variableEarning={variableEarning}
          variableSaving={variableSaving}
          variableSpending={variableSpending}
        />
      </PanelItem>
      <PanelItem hasBottomBorder>
        <Button
          isFullWidth
          onClick={() =>
            onSelect({
              category: Category.Earning,
              variability: Variability.Fixed,
            })
          }
          style={ButtonStyle.Unstyled}
        >
          <Row>
            <CategoryLabel
              category={Category.Earning}
              variability={Variability.Fixed}
            />
            <Text>{`${format(fixedEarning)}${remainingProjectedFixedEarning && ` (${formatShort(projectedFixedEarning)})`}`}</Text>
          </Row>
        </Button>
      </PanelItem>
      <PanelItem hasBottomBorder>
        <Button
          isFullWidth
          onClick={() =>
            onSelect({
              category: Category.Earning,
              variability: Variability.Variable,
            })
          }
          style={ButtonStyle.Unstyled}
        >
          <Row>
            <CategoryLabel
              category={Category.Earning}
              variability={Variability.Variable}
            />
            <Text>{format(variableEarning)}</Text>
          </Row>
        </Button>
      </PanelItem>
      <PanelItem hasBottomBorder>
        <Button
          isFullWidth
          onClick={() =>
            onSelect({
              category: Category.Saving,
              variability: Variability.Fixed,
            })
          }
          style={ButtonStyle.Unstyled}
        >
          <Row>
            <CategoryLabel
              category={Category.Saving}
              variability={Variability.Fixed}
            />
            <Text>{format(fixedSaving)}</Text>
          </Row>
        </Button>
      </PanelItem>
      <PanelItem hasBottomBorder>
        <Button
          isFullWidth
          onClick={() =>
            onSelect({
              category: Category.Saving,
              variability: Variability.Variable,
            })
          }
          style={ButtonStyle.Unstyled}
        >
          <Row>
            <CategoryLabel
              category={Category.Saving}
              variability={Variability.Variable}
            />
            <Text>{format(variableSaving)}</Text>
          </Row>
        </Button>
      </PanelItem>
      <PanelItem hasBottomBorder>
        <Button
          isFullWidth
          onClick={() =>
            onSelect({
              category: Category.Spending,
              variability: Variability.Fixed,
            })
          }
          style={ButtonStyle.Unstyled}
        >
          <Row>
            <CategoryLabel
              category={Category.Spending}
              variability={Variability.Fixed}
            />
            <Text>{`${format(fixedSpending)}${remainingProjectedFixedSpending && ` (${formatShort(projectedFixedSpending)})`}`}</Text>
          </Row>
        </Button>
      </PanelItem>
      <PanelItem>
        <Button
          isFullWidth
          onClick={() =>
            onSelect({
              category: Category.Spending,
              variability: Variability.Variable,
            })
          }
          style={ButtonStyle.Unstyled}
        >
          <Row>
            <CategoryLabel
              category={Category.Spending}
              variability={Variability.Variable}
            />
            <Text>{format(variableSpending)}</Text>
          </Row>
        </Button>
      </PanelItem>
    </Panel>
  );
}
