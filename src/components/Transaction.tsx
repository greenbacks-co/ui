import React, { FC, useContext } from 'react';
import styled from 'utils/styled';

import { Icon, IconType } from 'components/Icon';
import TagModalContext from 'context/TagModal';
import { Size, Text } from 'components/Text';
import useCurrencyFormatter from 'hooks/useCurrencyFormatter';
import TransactionType, { Category } from 'types/transaction';
import Button, { ButtonStyle } from './atoms/Button';

const Transaction: FC<{
  isBadgeVisible?: boolean;
  isCompact?: boolean;
  isDateVisible?: boolean;
  isFilteringEnabled?: boolean;
  transaction: TransactionType;
}> = ({
  isBadgeVisible = true,
  isCompact = false,
  isDateVisible = true,
  isFilteringEnabled = false,
  transaction,
}) => {
  const { format } = useCurrencyFormatter();
  const { openModal } = useContext(TagModalContext);
  const { amount, category, datetime, name, tag } = transaction;
  const hasTag = tag !== undefined;
  const isFilterButtonVisible = isFilteringEnabled && !hasTag;
  if (isCompact)
    return (
      <CompactGrid isFilterButtonVisible={isFilterButtonVisible}>
        <Text>{format({ value: amount })}</Text>
        <Text canOverflow={false} isRightAligned size={Size.Small}>
          {name}
        </Text>
        {isFilterButtonVisible && (
          <Button
            onClick={() => openModal(transaction)}
            style={ButtonStyle.Unstyled}
          >
            <Icon icon={IconType.Tag} />
          </Button>
        )}
      </CompactGrid>
    );
  return (
    <Grid $category={category}>
      <p id="amount">{format({ value: amount })}</p>
      {isFilterButtonVisible && (
        <Button
          onClick={() => openModal(transaction)}
          style={ButtonStyle.Unstyled}
        >
          <Icon icon={IconType.Tag} />
        </Button>
      )}
      <p id="name">{name}</p>
      {isBadgeVisible && (
        <Badges>
          <CategoryBadge $category={category} />
          <p>{category}</p>
          <p>{tag}</p>
        </Badges>
      )}
      {isDateVisible && <p id="date">{datetime}</p>}
    </Grid>
  );
};

const Grid = styled.div<{ $category: Category }>`
  align-items: center;
  display: grid;
  grid-gap: 0 5px;
  grid-template-areas:
    'amount   filter'
    'name     name'
    'merchant merchant'
    'badges   date';
  grid-template-columns: 1fr max-content;
  min-width: 200px;

  p {
    margin: 0;
  }

  #amount {
    grid-area: amount;
    font-size: 1em;
    font-weight: 700;
    padding: 8px 0;
  }

  #date {
    grid-area: date;
    font-size: 0.7em;
    text-align: right;
  }

  #name {
    grid-area: name;
    font-size: 0.8em;
    margin-bottom: 2px;
  }

  button {
    grid-area: filter;
    justify-self: end;
  }
`;

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

const CompactGrid = styled.div<{ isFilterButtonVisible?: boolean }>`
  align-items: baseline;
  display: grid;
  gap: 16px;
  grid-template-columns: ${({ isFilterButtonVisible = false }) =>
    isFilterButtonVisible ? 'max-content 1fr max-content' : 'max-content 1fr'};
  min-width: 200px;
`;

export default Transaction;
