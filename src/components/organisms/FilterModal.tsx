import React, { useState } from 'react';
import styled from 'styled-components';

import useTags from 'hooks/useTags';
import { Comparator, FilterInput } from 'types/filter';
import Transaction, { Category } from 'types/transaction';
import { Variability, VARIABILITY_OPTIONS } from 'types/variability';
import noop from 'utils/noop';
import Typeahead from '../molecules/Typeahead';
import RadioButtons from '../atoms/RadioButtons';
import { Modal } from '../molecules/Modal';
import Label from '../atoms/Label';
import Button from '../atoms/Button';

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
        <div>
          <Label>Assign category</Label>
          <RadioButtons
            name="category"
            options={Object.values(Category)}
            onChange={(input) => onSelectCategory(input as Category)}
            value={selectedCategory}
          />
        </div>
        {selectedCategory !== Category.Hidden && (
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
  const { filtersByTag, tags } = useTags();
  const [selectedTag, selectTag] = useState<string | undefined>();
  const matchingFilter = filtersByTag?.[selectedTag ?? '']?.[0];
  const [selectedProperty, selectProperty] = useState<
    PropertyToMatch | undefined
  >();
  const [selectedCategory, selectCategory] = useState<Category | undefined>();
  const [selectedVariability, selectVariability] = useState<
    Variability | undefined
  >();
  const property =
    selectedProperty ??
    (matchingFilter?.matchers?.[0]?.property as PropertyToMatch) ??
    PropertyToMatch.Merchant;
  const category =
    selectedCategory ??
    matchingFilter?.categoryToAssign ??
    transaction.category;
  const variability =
    selectedVariability ??
    matchingFilter?.variabilityToAssign ??
    Variability.Variable;
  const filterToSave = {
    categoryToAssign: category,
    matchers: [
      {
        comparator: Comparator.Equals,
        property,
        expectedValue: transaction[property],
      },
    ],
    tagToAssign: category !== Category.Hidden ? selectedTag : undefined,
    variabilityToAssign: category !== Category.Hidden ? variability : undefined,
  };
  return (
    <NewFilterModal
      existingTags={tags}
      onClose={onClose}
      onSave={() => {
        onSave(filterToSave);
      }}
      onSelectCategory={selectCategory}
      onSelectProperty={selectProperty}
      onSelectTag={selectTag}
      onSelectVariability={selectVariability}
      selectedCategory={category}
      selectedProperty={property}
      selectedTag={selectedTag}
      selectedVariability={variability}
      transaction={transaction}
    />
  );
}
