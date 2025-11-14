import React, { FC, useState, useEffect } from 'react';

import Typeahead from 'components/Typeahead';
import useAddFilter from 'hooks/useAddFilter';
import useTags from 'hooks/useTags';
import { Comparator } from 'types/filter';
import Transaction, { Category } from 'types/transaction';
import RadioButtons from './atoms/RadioButtons';
import Label from './atoms/Label';
import Button from './atoms/Button';

const AddFilter: FC<{ transaction: Transaction }> = ({ transaction }) => {
  const [category, setCategory] = useState<string>(transaction.category);
  const { merchant, name } = transaction;
  const { addFilter, hasBeenCalled, isSaving } = useAddFilter();
  const { tags } = useTags();
  const [property, setProperty] = useState<string>('name');
  const [tag, setTag] = useState<string>();
  const [hasAdded, setHasAdded] = useState<boolean>(false);

  useEffect(() => {
    if (hasBeenCalled && !isSaving) setHasAdded(true);
  }, [hasBeenCalled, isSaving]);

  return (
    <>
      <form>
        <RadioButtons
          name="property"
          options={[
            { label: `Transactions with name '${name}'`, value: 'name' },
            {
              label: `Transactions from merchant '${merchant}'`,
              value: 'merchant',
            },
            { label: 'Only this transaction', value: 'id' },
          ]}
          onChange={(newProperty) => setProperty(newProperty)}
          value={property}
        />
        <RadioButtons
          label="Category"
          name="category"
          options={Object.values(Category)}
          onChange={(newCategory) => setCategory(newCategory)}
          value={category}
        />
        <Label forId="tags">Tag</Label>
        <Typeahead id="tags" onChange={setTag} options={tags} value={tag} />
        <Button
          onClick={() => {
            if (!property) return;
            addFilter({
              filter: {
                categoryToAssign: category as Category,
                matchers: [
                  {
                    comparator: Comparator.Equals,
                    property,
                    expectedValue: getExpectedValue({ property, transaction }),
                  },
                ],
                tagToAssign: tag,
              },
            });
          }}
        >
          Add filter
        </Button>
      </form>
      {hasAdded && <p>Added!</p>}
    </>
  );
};

const PROPERTY_OPTIONS = [
  { label: 'Name', value: 'name' },
  { label: 'Id', value: 'id' },
];

const getExpectedValue = ({
  property,
  transaction,
}: {
  property: string;
  transaction: Transaction;
}): string => {
  const { id, merchant, name } = transaction;
  switch (property) {
    case 'id':
      return id;
    case 'merchant':
      return merchant;
    case 'name':
      return name;
    default:
      return name;
  }
};

export default AddFilter;
