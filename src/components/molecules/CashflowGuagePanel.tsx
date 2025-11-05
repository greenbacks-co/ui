import { CashflowGuage } from 'components/atoms/charts/CashflowGuage';
import { JustifiedRow } from 'components/JustifiedRow';
import { Panel, PanelItem } from 'components/Panel';
import { Text } from 'components/Text';
import useCurrencyFormatter from 'hooks/useCurrencyFormatter';
import React, { ReactElement } from 'react';

export function CashflowGuagePanel({
  fixedEarning = 0,
  fixedSaving = 0,
  fixedSpending = 0,
  variableEarning = 0,
  variableSaving = 0,
  variableSpending = 0,
}: {
  fixedEarning?: number;
  fixedSaving?: number;
  fixedSpending?: number;
  variableEarning?: number;
  variableSaving?: number;
  variableSpending?: number;
}): ReactElement {
  const { format } = useCurrencyFormatter();
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
          variableEarning={variableEarning}
          variableSaving={variableSaving}
          variableSpending={variableSpending}
        />
      </PanelItem>
      <PanelItem hasBottomBorder>
        <JustifiedRow>
          <Text>Fixed Earning</Text>
          <Text>{format(fixedEarning)}</Text>
        </JustifiedRow>
      </PanelItem>
      <PanelItem hasBottomBorder>
        <JustifiedRow>
          <Text>Variable Earning</Text>
          <Text>{format(variableEarning)}</Text>
        </JustifiedRow>
      </PanelItem>
      <PanelItem hasBottomBorder>
        <JustifiedRow>
          <Text>Fixed Saving</Text>
          <Text>{format(fixedSaving)}</Text>
        </JustifiedRow>
      </PanelItem>
      <PanelItem hasBottomBorder>
        <JustifiedRow>
          <Text>Variable Saving</Text>
          <Text>{format(variableSaving)}</Text>
        </JustifiedRow>
      </PanelItem>
      <PanelItem hasBottomBorder>
        <JustifiedRow>
          <Text>Fixed Spending</Text>
          <Text>{format(fixedSpending)}</Text>
        </JustifiedRow>
      </PanelItem>
      <PanelItem>
        <JustifiedRow>
          <Text>Variable Spending</Text>
          <Text>{format(variableSpending)}</Text>
        </JustifiedRow>
      </PanelItem>
    </Panel>
  );
}
