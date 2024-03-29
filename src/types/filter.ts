import { Category } from 'types/transaction';

export interface Filter {
  categoryToAssign: Category;
  id: string;
  matchers: MatcherGroup;
  tagToAssign?: string;
}

export interface FilterInput {
  categoryToAssign: Category;
  matchers: MatcherGroup;
  tagToAssign?: string;
}

export type MatcherGroup = Matcher[];

export interface Matcher {
  comparator?: Comparator;
  expectedValue: string;
  property: string;
}

export enum Comparator {
  Equals = 'Equals',
  GreaterThan = 'greater-than',
  LessThan = 'less-than',
}
