import { gql } from '@apollo/client';
import React from 'react';

import { FiltersContext } from 'context/Filters';
import type { Category } from 'types/transaction';
import type { Matcher } from 'types/filter';

const useAddFilter = (): {
  addFilter: (input: { filter: AddFilterVariables }) => void;
  hasBeenCalled: boolean;
  isSaving: boolean;
} => {
  const { addFilter, isAdding } = React.useContext(FiltersContext);
  const [hasCalled, setHasCalled] = React.useState<boolean>(false);
  return {
    addFilter: ({ filter }) => {
      setHasCalled(true);
      addFilter({ filter });
    },
    hasBeenCalled: hasCalled,
    isSaving: isAdding,
  };
};

interface AddFilterVariables {
  categoryToAssign: Category;
  matchers: Matcher[];
  tagToAssign?: string;
}

export const ADD_FILTER_MUTATION = gql`
  mutation AddFilter(
    $categoryToAssign: Category!
    $matchers: [MatcherInput]!
    $tagToAssign: String
    $variabilityToAssign: Variability
  ) {
    addFilter(
      input: {
        categoryToAssign: $categoryToAssign
        matchers: $matchers
        tagToAssign: $tagToAssign
        variabilityToAssign: $variabilityToAssign
      }
    ) {
      categoryToAssign
      id
      matchers {
        comparator
        expectedValue
        property
      }
      tagToAssign
      variabilityToAssign
    }
  }
`;

export default useAddFilter;
