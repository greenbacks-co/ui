import { Category } from 'types/transaction';
import type { Variability } from 'types/variability';

export interface Filter {
  categoryToAssign: Category;
  id: string;
  matchers: MatcherGroup;
  tagToAssign?: string;
  variabilityToAssign?: Variability;
}

export interface FilterInput {
  categoryToAssign: Category;
  matchers: MatcherGroup;
  tagToAssign?: string;
  variabilityToAssign?: Variability;
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
