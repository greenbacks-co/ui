import useCurrencyFormatter from 'hooks/useCurrencyFormatter';
import React, { ReactElement } from 'react';
import { Pie, PieChart, ResponsiveContainer } from 'recharts';
import { Category } from 'types/transaction';
import { Variability } from 'types/variability';
import { CATEGORY_COLOURS } from 'utils/categoryColours';
import noop from 'utils/noop';
import List, { Item } from '../atoms/List';
import { Panel, PanelItem } from '../atoms/Panel';
import { Row } from '../atoms/Row';
import { Text } from '../atoms/Text';
import Button, { ButtonStyle } from '../atoms/Button';
import { CategoryLabel } from './CategoryLabel';

export function CategoryBreakdownPanel({
  category,
  onSelect = noop,
  tags = [],
  variability,
}: {
  category?: Category;
  onSelect?: (input: string) => void;
  tags?: Array<{
    name: string;
    total: number;
  }>;
  variability?: Variability;
}): ReactElement {
  const { format } = useCurrencyFormatter();
  if (!category || !variability) return <></>;
  return (
    <Panel>
      <PanelItem hasBottomBorder>
        <CategoryLabel category={category} variability={variability} />
      </PanelItem>
      <PanelItem hasBottomBorder>
        <ResponsiveContainer aspect={1.4} height="max-content" width="100%">
          <PieChart>
            <Pie
              data={tags.map(({ name, total }) => ({
                fill: CATEGORY_COLOURS[category][variability],
                name,
                value: total,
              }))}
              dataKey="value"
              endAngle={-270}
              isAnimationActive={false}
              startAngle={90}
            />
          </PieChart>
        </ResponsiveContainer>
      </PanelItem>
      <List hasOutsideBorder={false}>
        {tags
          .sort((a, b) => (a.total > b.total ? -1 : 1))
          .map(({ name, total }) => (
            <Item>
              <Button
                isFullWidth
                onClick={() => onSelect(name)}
                style={ButtonStyle.Unstyled}
              >
                <Row>
                  <Text>{name}</Text>
                  <Text>{format(total)}</Text>
                </Row>
              </Button>
            </Item>
          ))}
      </List>
    </Panel>
  );
}
