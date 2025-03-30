export enum Variability {
  Fixed = 'Fixed',
  Variable = 'Variable',
}

export const VARIABILITY_OPTIONS = [
  {
    label: 'Bills',
    value: Variability.Fixed,
  },
  {
    label: 'Discretionary',
    value: Variability.Variable,
  },
];
