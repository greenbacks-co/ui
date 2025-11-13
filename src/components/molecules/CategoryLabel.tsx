import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { CATEGORY_COLOURS } from 'utils/categoryColours';
import { Text } from '../atoms/Text';

import { Category } from '../../types/transaction';
import { Variability } from '../../types/variability';

export function CategoryLabel({
  category,
  variability,
}: {
  category: Category;
  variability: Variability;
}): ReactElement {
  return (
    <Wrapper>
      <Badge $colour={CATEGORY_COLOURS[category][variability]} />
      <Text>{CATEGORY_LABELS[category][variability]}</Text>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  gap: 8px;
`;

const Badge = styled.div<{ $colour: string }>`
  background: ${({ $colour }) => $colour};
  border-radius: 50%;
  height: 8px;
  width: 8px;
`;

export const CATEGORY_LABELS: Record<Category, Record<Variability, string>> = {
  [Category.Earning]: {
    [Variability.Fixed]: 'Fixed Earning',
    [Variability.Variable]: 'Variable Earning',
  },
  [Category.Hidden]: {
    [Variability.Fixed]: 'Hidden',
    [Variability.Variable]: 'Hidden',
  },
  [Category.Saving]: {
    [Variability.Fixed]: 'Fixed Saving',
    [Variability.Variable]: 'Variable Saving',
  },
  [Category.Spending]: {
    [Variability.Fixed]: 'Fixed Spending',
    [Variability.Variable]: 'Variable Spending',
  },
};
