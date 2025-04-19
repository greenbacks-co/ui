import useFilters from 'hooks/useFilters';
import type { Filter } from 'types/filter';
import { GroupBy, groupFilters, SortGroupsBy } from 'utils/groupFilters';

const useTags = (): {
  filtersByTag?: Record<string, Filter[]>;
  isLoading: boolean;
  tags?: string[];
} => {
  const { filters, isLoading } = useFilters();
  const groupedFilters = groupFilters({
    filters,
    groupBy: GroupBy.Tag,
    sortGroupsBy: SortGroupsBy.Count,
  });
  const tags = groupedFilters
    ?.map((group) => group.key)
    .filter((tag) => tag !== 'Untagged');
  const filtersByTag = groupedFilters?.reduce(
    (result, group) => ({ ...result, [group.key]: group.filters }),
    {},
  );
  return {
    filtersByTag,
    isLoading,
    tags,
  };
};

export enum SortBy {
  FilterCount = 'filterCount',
  Name = 'name',
}

export enum SortDirection {
  Asc = 'ascending',
  Desc = 'descending',
}

export default useTags;
