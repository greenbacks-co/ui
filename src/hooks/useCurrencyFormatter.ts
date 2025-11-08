import { useContext } from 'react';

import { CurrencyLocalesContext } from 'context/CurrencyLocales';

const useCurrencyFormatter = ({
  shorten,
}: { shorten?: boolean } = {}): UseCurrencyFormatterResult => {
  const { locales } = useContext(CurrencyLocalesContext);
  return {
    format: (input) => {
      const { currency = 'CAD', value = 0 } = parseInput(input);
      const formatter = Intl.NumberFormat(locales, {
        currency,
        style: 'currency',
        notation: shorten ? 'compact' : undefined,
      });
      return formatter.format(prepareValue({ currency, value }));
    },
  };
};

function parseInput(input: FormatInput | number): FormatInput {
  if (typeof input === 'number') return { value: input };
  return input;
}

const prepareValue = ({
  currency,
  value = 0,
}: {
  currency: string;
  value?: number;
}): number => {
  switch (currency) {
    case 'CAD':
    case 'USD': {
      // convert cents to dollars
      return value / 100;
    }
    default: {
      return value;
    }
  }
};

interface UseCurrencyFormatterResult {
  format: Format;
}

type Format = (input: FormatInput | number) => string;

interface FormatInput {
  currency?: string;
  value?: number;
}

export default useCurrencyFormatter;
