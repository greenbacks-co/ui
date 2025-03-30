import React, { useState } from 'react';
import styled from 'styled-components';

import Button from 'components/Button';
import Label from 'components/Label';
import { Modal } from 'components/Modal';
import RadioButtons from 'components/RadioButtons';
import Typeahead from 'components/Typeahead';
import useTags from 'hooks/useTags';
import { Comparator, FilterInput } from 'types/filter';
import Transaction, { Category } from 'types/transaction';
import { Variability, VARIABILITY_OPTIONS } from 'types/variability';
import noop from 'utils/noop';

export function NewFilterModal({
  existingTags = [],
  onClose = noop,
  onSave = noop,
  onSelectCategory = noop,
  onSelectProperty = noop,
  onSelectTag = noop,
  onSelectVariability = noop,
  selectedCategory,
  selectedProperty,
  selectedTag,
  selectedVariability,
  transaction,
}: {
  existingTags?: string[];
  onClose?: () => void;
  onSave?: () => void;
  onSelectCategory?: (input: Category) => void;
  onSelectProperty?: (input: PropertyToMatch) => void;
  onSelectTag?: (input: string) => void;
  onSelectVariability?: (input: Variability) => void;
  selectedCategory?: Category;
  selectedProperty?: PropertyToMatch;
  selectedTag?: string;
  selectedVariability?: Variability;
  transaction: Transaction;
}): React.ReactElement {
  const { merchant, name } = transaction;
  return (
    <Modal onClose={onClose} title="Add Filter">
      <Form
        onSubmit={(event) => {
          event.preventDefault();
          onSave();
        }}
      >
        <div>
          <Label>Match</Label>
          <RadioButtons
            name="property"
            options={[
              {
                label: `All transactions from merchant '${merchant}'`,
                value: 'merchant',
              },
              { label: `All transactions with name '${name}'`, value: 'name' },
              { label: 'Only this transaction', value: 'id' },
            ]}
            onChange={(input) => {
              onSelectProperty(input as PropertyToMatch);
            }}
            value={selectedProperty}
          />
        </div>
        <div>
          <Label>Assign category</Label>
          <RadioButtons
            name="category"
            options={Object.values(Category)}
            onChange={(input) => onSelectCategory(input as Category)}
            value={selectedCategory}
          />
        </div>
        {selectedCategory === Category.Spending && (
          <div>
            <Label>Assign Variability</Label>
            <RadioButtons
              name="variability"
              options={VARIABILITY_OPTIONS}
              onChange={(input) => onSelectVariability(input as Variability)}
              value={selectedVariability}
            />
          </div>
        )}
        {selectedCategory !== Category.Hidden && (
          <div>
            <Label forId="tags">Add tag</Label>
            <Typeahead
              id="tags"
              onChange={onSelectTag}
              options={existingTags}
              placeholder="Search or add new tag"
              value={selectedTag}
              visibleOptionCount={3}
            />
          </div>
        )}
        <Button onClick={onSave}>Save</Button>
      </Form>
    </Modal>
  );
}

export enum PropertyToMatch {
  Id = 'id',
  Merchant = 'merchant',
  Name = 'name',
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 8px;
`;

export function NewFilterModalContainer({
  onClose = noop,
  onSave = noop,
  transaction,
}: {
  onClose?: () => void;
  onSave?: (input: FilterInput) => void;
  transaction: Transaction;
}): React.ReactElement {
  const { tags } = useTags();
  const [selectedProperty, selectProperty] = useState<PropertyToMatch>(
    PropertyToMatch.Merchant,
  );
  const [selectedCategory, selectCategory] = useState<Category>(
    transaction.category,
  );
  const [selectedTag, selectTag] = useState<string | undefined>();
  const [selectedVariability, selectVariability] = useState<Variability>(
    Variability.Variable,
  );
  return (
    <NewFilterModal
      existingTags={tags}
      onClose={onClose}
      onSave={() => {
        onSave({
          categoryToAssign: selectedCategory,
          matchers: [
            {
              comparator: Comparator.Equals,
              property: selectedProperty,
              expectedValue: transaction[selectedProperty],
            },
          ],
          tagToAssign: selectedTag,
          variabilityToAssign:
            selectedCategory === Category.Spending
              ? selectedVariability
              : undefined,
        });
      }}
      onSelectCategory={selectCategory}
      onSelectProperty={selectProperty}
      onSelectTag={selectTag}
      onSelectVariability={selectVariability}
      selectedCategory={selectedCategory}
      selectedProperty={selectedProperty}
      selectedTag={selectedTag}
      selectedVariability={selectedVariability}
      transaction={transaction}
    />
  );
}
