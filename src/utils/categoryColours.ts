import { Category } from '../types/transaction';
import { Variability } from '../types/variability';

export const CATEGORY_COLOURS: Record<Category, Record<Variability, string>> = {
  [Category.Earning]: {
    [Variability.Fixed]: 'darkgreen',
    [Variability.Variable]: 'lightgreen',
  },
  [Category.Hidden]: {
    [Variability.Fixed]: 'grey',
    [Variability.Variable]: 'grey',
  },
  [Category.Saving]: {
    [Variability.Fixed]: 'darkblue',
    [Variability.Variable]: 'lightblue',
  },
  [Category.Spending]: {
    [Variability.Fixed]: 'darkorange',
    [Variability.Variable]: 'orange',
  },
};
