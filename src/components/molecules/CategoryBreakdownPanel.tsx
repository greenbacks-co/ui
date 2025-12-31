import useCurrencyFormatter from 'hooks/useCurrencyFormatter';
import React, { ReactElement } from 'react';
import { Pie, PieChart, ResponsiveContainer } from 'recharts';
import { Category } from 'types/transaction';
import { Variability } from 'types/variability';
import { CATEGORY_COLOURS } from 'utils/categoryColours';
import noop from 'utils/noop';
import List, { Item } from '../atoms/List';
import { Panel, PanelItem } from '../atoms/Panel';
import { Alignment, Row, Space } from '../atoms/Row';
import { Size, Text } from '../atoms/Text';
import Button, { ButtonStyle } from '../atoms/Button';
import { CategoryLabel } from './CategoryLabel';
import { Placeholder } from '../atoms/Placeholder';

export function CategoryBreakdownPanel({
  category,
  loading = false,
  onSelect = noop,
  tags = [],
  tagAverages = {},
  variability,
}: {
  category?: Category;
  loading?: boolean;
  onSelect?: (input: string) => void;
  tags?: Array<{
    name: string;
    total: number;
  }>;
  tagAverages?: Record<string, number>;
  variability?: Variability;
}): ReactElement {
  const { format } = useCurrencyFormatter();
  if (loading)
    return (
      <Panel>
        <PanelItem hasBottomBorder>
          <Text>Category Breakdown</Text>
        </PanelItem>
        <Placeholder loading />
      </Panel>
    );
  if (!category || !variability)
    return (
      <Panel>
        <PanelItem hasBottomBorder>
          <Text>Category Breakdown</Text>
        </PanelItem>
        <Placeholder>Please Select a Category</Placeholder>
      </Panel>
    );
  if (tags.length === 0)
    return (
      <Panel>
        <PanelItem hasBottomBorder>
          <Text>Category Breakdown</Text>
        </PanelItem>
        <Placeholder>Selected Category is Empty</Placeholder>
      </Panel>
    );
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
          .map(({ name, total }) => {
            const difference = total - tagAverages[name];
            const differenceFraction = Math.abs(difference / total);
            return (
              <Item>
                <Button
                  isFullWidth
                  onClick={() => onSelect(name)}
                  style={ButtonStyle.Unstyled}
                >
                  <Row alignment={Alignment.End} space={Space.Medium}>
                    <Text isFullWidth>{name}</Text>
                    {tagAverages[name] && differenceFraction > 0.2 && (
                      <Text size={Size.Small}>
                        ({difference > 0 && '+'}
                        {format(difference)})
                      </Text>
                    )}
                    <Text>{format(total)}</Text>
                  </Row>
                </Button>
              </Item>
            );
          })}
      </List>
    </Panel>
  );
}
