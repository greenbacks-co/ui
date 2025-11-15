import React, { FC } from 'react';

import Checkboxes from 'components/Checkboxes';
import { Category } from 'types/transaction';
import noop from 'utils/noop';

const TransactionSelector: FC<{
  onChangeSelectedCategories?: (categories: string[]) => void;
  onChangeSelectedEarningTags?: (tags: string[]) => void;
  onChangeSelectedSavingTags?: (tags: string[]) => void;
  onChangeSelectedSpendingTags?: (tags: string[]) => void;
  selectableCategories?: Category[];
  selectedCategories?: Category[];
  selectableEarningTags?: string[];
  selectedEarningTags?: string[];
  selectableSavingTags?: string[];
  selectedSavingTags?: string[];
  selectableSpendingTags?: string[];
  selectedSpendingTags?: string[];
}> = ({
  onChangeSelectedCategories = noop,
  onChangeSelectedEarningTags = noop,
  onChangeSelectedSavingTags = noop,
  onChangeSelectedSpendingTags = noop,
  selectableCategories = [],
  selectableEarningTags = [],
  selectableSavingTags = [],
  selectableSpendingTags = [],
  selectedCategories = [],
  selectedEarningTags = [],
  selectedSavingTags = [],
  selectedSpendingTags = [],
}) => (
  <>
    <Checkboxes
      label="Categories"
      onChange={onChangeSelectedCategories}
      options={selectableCategories}
      selectedOptions={selectedCategories}
    />
    {selectableEarningTags.length > 0 &&
      selectedCategories.includes(Category.Earning) && (
        <Checkboxes
          label="Earning Tags"
          onChange={onChangeSelectedEarningTags}
          options={selectableEarningTags}
          selectedOptions={selectedEarningTags}
        />
      )}
    {selectableSavingTags.length > 0 &&
      selectedCategories.includes(Category.Saving) && (
        <Checkboxes
          label="Saving Tags"
          onChange={onChangeSelectedSavingTags}
          options={selectableSavingTags}
          selectedOptions={selectedSavingTags}
        />
      )}
    {selectableSpendingTags.length > 0 &&
      selectedCategories.includes(Category.Spending) && (
        <Checkboxes
          label="Spending Tags"
          onChange={onChangeSelectedSpendingTags}
          options={selectableSpendingTags}
          selectedOptions={selectedSpendingTags}
        />
      )}
  </>
);

export default TransactionSelector;
