import React, { FC } from 'react';

import { Category } from 'types/transaction';
import styled from 'utils/styled';

const CategoryAndTagIndicators: FC<{ category: Category; tag?: string }> = ({
  category,
  tag,
}) => (
  <Badges>
    <CategoryBadge $category={category} />
    <p>{category}</p>
    {tag && <p>{tag}</p>}
  </Badges>
);

const Badges = styled.div`
  align-items: center;
  gap: 4px;
  grid-area: badges;
  margin-bottom: 4px;
  margin-top: 2px;

  display: grid;
  grid-template-columns: max-content max-content 1fr max-content;

  p {
    font-size: 0.6em;
    padding: 0;
  }
`;

const CategoryBadge = styled.div<{ $category: Category }>`
  background-color: ${(props) => getCategoryColour(props.$category)};
  border-radius: 50%;
  height: 12px;
  width: 12px;
`;

function getCategoryColour(category: Category): string {
  if (category === Category.Earning) return 'green';
  if (category === Category.Spending) return 'orange';
  if (category === Category.Saving) return 'blue';
  return 'grey';
}

export default CategoryAndTagIndicators;
