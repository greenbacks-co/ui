import React, { FC, useContext } from 'react';
import styled from 'utils/styled';

import Button, { ButtonStyle } from 'components/Button';
import TagModalContext from 'context/TagModal';
import useCurrencyFormatter from 'hooks/useCurrencyFormatter';
import TransactionType, { Category } from 'types/transaction';

const Transaction: FC<{
  isDateVisible?: boolean;
  isFilteringEnabled?: boolean;
  transaction: TransactionType;
}> = ({ isDateVisible = true, isFilteringEnabled = false, transaction }) => {
  const { format } = useCurrencyFormatter();
  const { amount, category, datetime, name, tag } = transaction;
  const { openModal } = useContext(TagModalContext);
  return (
    <Grid $category={category}>
      <p id="amount">{format({ value: amount })}</p>
      {isFilteringEnabled && (
        <Button onClick={() => openModal(transaction)} style={ButtonStyle.Text}>
          Edit tag
        </Button>
      )}
      <p id="name">{name}</p>
      <Badges>
        <CategoryBadge $category={category} />
        <p>{category}</p>
        <p>{tag}</p>
        {isDateVisible && <p>{datetime}</p>}
      </Badges>
    </Grid>
  );
};

const Grid = styled.div<{ $category: Category }>`
  display: grid;
  grid-gap: 0 5px;
  grid-template-areas:
    'amount   filter'
    'name     name'
    'merchant merchant'
    'badges   badges';
  grid-template-columns: 1fr max-content;

  p {
    margin: 0.25em;
  }

  #amount {
    grid-area: amount;
    font-size: 1em;
    font-weight: 700;
    margin-bottom: 12px;
    margin-top: 6px;
  }

  #date {
    grid-area: date;
    font-size: 0.7em;
  }

  #name {
    grid-area: name;
    font-size: 0.8em;
    margin-bottom: 2px;
  }

  button {
    grid-area: filter;
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

export default Transaction;
