import { Comparator, Filter, Matcher } from 'types/filter';
import { Category, CoreTransaction } from 'types/transaction';

export const buildFilter = ({
  categoryToAssign = Category.Spending,
  id = 'test-filter-id',
  matchers = [],
  tagToAssign,
}: {
  categoryToAssign?: Category;
  id?: string;
  matchers?: Matcher[];
  tagToAssign?: string;
}): Filter => ({
  categoryToAssign,
  id,
  matchers,
  tagToAssign,
});

export const buildMatcher = ({
  comparator = Comparator.Equals,
  expectedValue = 'test-expected-value',
  property = 'name',
}: {
  comparator?: Comparator;
  expectedValue: string;
  property: keyof CoreTransaction;
}): Matcher => ({
  comparator,
  expectedValue,
  property,
});

export default buildFilter;
