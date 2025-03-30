import { gql, useMutation, useQuery } from '@apollo/client';
import React, {
  createContext,
  FC,
  Reducer,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { v4 as generateUuid } from 'uuid';

import { Filter, FilterInput } from 'types/filter';
import noop from 'utils/noop';

export const FiltersContext = createContext<{
  addFilter: (input: { filter: FilterInput }) => void;
  error?: Error;
  filters?: Filter[];
  isAdding: boolean;
  isLoading: boolean;
}>({ addFilter: noop, isAdding: false, isLoading: false });

export const LocalStorageFiltersProvider: FC = ({ children }) => {
  const { idFilters: initialIdFilters = [], filters: initialFilters = [] } =
    getFiltersFromStorage();
  const { addFilter, filters } = useFilters({
    initialIdFilters,
    initialFilters,
  });
  useEffect(() => {
    localStorage.setItem(
      'filters',
      JSON.stringify({
        filters,
      }),
    );
  }, [filters]);
  return (
    <FiltersContext.Provider
      value={{
        addFilter,
        filters,
        isAdding: false,
        isLoading: false,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
};

const getFiltersFromStorage = (): {
  idFilters: Filter[];
  filters: Filter[];
} => {
  const serializedFilters = localStorage.getItem('filters');
  if (!serializedFilters)
    return {
      idFilters: [],
      filters: [],
    };
  const { idFilters = [], filters = [] } = JSON.parse(serializedFilters);
  return {
    idFilters,
    filters,
  };
};

export function MemoryFiltersProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [filters, setFilters] = React.useState<Filter[]>([]);
  return (
    <FiltersContext.Provider
      value={{
        addFilter: ({ filter }) => {
          const newFilters = [...filters, { ...filter, id: generateUuid() }];
          setFilters(newFilters);
        },
        filters,
        isAdding: false,
        isLoading: false,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
}

const useFilters = ({
  initialIdFilters,
  initialFilters,
}: {
  initialIdFilters: Filter[];
  initialFilters: Filter[];
}): {
  addFilter: (input: { filter: FilterInput }) => void;
  filters: Filter[];
} => {
  const [{ idFilters, filters }, dispatch] = useReducer<Reducer<State, Action>>(
    reducer,
    {
      idFilters: initialIdFilters,
      filters: initialFilters,
    },
  );
  const addFilter = useCallback(
    ({ filter }) => {
      dispatch({
        payload: { filter },
        type: ActionType.AddFilter,
      });
    },
    [dispatch],
  );
  const allFilters = useMemo(
    () => [...idFilters, ...filters],
    [idFilters, filters],
  );
  return {
    addFilter,
    filters: allFilters,
  };
};

interface State {
  idFilters: Filter[];
  filters: Filter[];
}

type Action = AddFilterAction;

enum ActionType {
  AddFilter = 'addFilter',
}

interface AddFilterAction {
  payload: AddFilterPayload;
  type: ActionType.AddFilter;
}

interface AddFilterPayload {
  filter: FilterInput;
}

const reducer: Reducer<State, Action> = (state, { payload, type }) => {
  switch (type) {
    case ActionType.AddFilter:
      return handleAddFilterAction({ payload, state });
    default:
      return state;
  }
};

const handleAddFilterAction = ({
  payload: { filter },
  state,
}: {
  payload: AddFilterPayload;
  state: State;
}): State => {
  const { idFilters, filters } = state;
  const isIdFilter = filter.matchers.some(({ property }) => property === 'id');
  const newFilter = { ...filter, id: generateUuid() };
  const newIdFilters = isIdFilter ? [...idFilters, newFilter] : idFilters;
  const newFilters = !isIdFilter ? [...filters, newFilter] : filters;
  return {
    ...state,
    idFilters: newIdFilters,
    filters: newFilters,
  };
};

export function TestFiltersProvider({
  children,
  filters = [],
  onAddFilter = noop,
}: {
  children: React.ReactNode;
  filters?: Filter[];
  onAddFilter?: (input: { filter: FilterInput }) => void;
}): React.ReactElement {
  return (
    <FiltersContext.Provider
      value={{
        addFilter: onAddFilter,
        filters,
        isAdding: false,
        isLoading: false,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
}

export function ApiFiltersProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const response = useQuery(FILTERS_QUERY);
  const { error, data, loading: isLoadingFilters } = response;
  const [mutate, status] = useMutation(ADD_FILTER_MUTATION, {
    refetchQueries: ['GetFilters'],
  });
  const { loading: isAdding } = status;
  return (
    <FiltersContext.Provider
      value={{
        addFilter: ({ filter }) => mutate({ variables: filter }),
        error,
        filters: data?.filters || [],
        isAdding,
        isLoading: isLoadingFilters,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
}

export const FILTERS_QUERY = gql`
  query GetFilters {
    filters {
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

export default FiltersContext;
