import React, { FC } from 'react';

import CategoryAndTagIndicators from 'components/CategoryAndTagIndicators';
import useFilters from 'hooks/useFilters';
import { Filter as FilterType, Matcher as MatcherType } from 'types/filter';
import groupFilters from 'utils/groupFilters';
import List, { Item } from './atoms/List';

const Filters: FC = () => {
  const { filters } = useFilters();
  const groupedFilters = groupFilters({ filters });
  return (
    <>
      <h1>Filters</h1>
      {groupedFilters?.map((group) => {
        const headingText = `${group.key} (${group.filters.length})`;
        return (
          <React.Fragment key={group.key}>
            <h2>{headingText}</h2>
            <List key={group.key}>
              {group.filters?.map((filter) => (
                <Item key={filter.id}>
                  <Filter filter={filter} />
                </Item>
              ))}
            </List>
          </React.Fragment>
        );
      })}
    </>
  );
};

const Filter: FC<{ filter: FilterType }> = ({ filter }) => (
  <>
    {filter.matchers.map((matcher) => (
      <Matcher matcher={matcher} />
    ))}
    <CategoryAndTagIndicators
      category={filter.categoryToAssign}
      tag={filter.tagToAssign}
    />
  </>
);

const Matcher: FC<{ matcher: MatcherType }> = ({ matcher }) => {
  const text = `${matcher.property} ${matcher.comparator} ${matcher.expectedValue}`;
  return <p>{text}</p>;
};

export default Filters;
