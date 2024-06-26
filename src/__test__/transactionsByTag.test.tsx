import React from 'react';
import { render, screen, within } from '@testing-library/react';

import Greenbacks from 'components/Greenbacks';
import { TestGreenbacksProvider } from 'context/Greenbacks';
import buildApiTransactionsMock from '__test__/utils/buildApiTransactionsMock';
import buildFiltersMock from '__test__/utils/buildFiltersMock';
import buildFilter, { buildMatcher } from '__test__/utils/buildFilter';
import buildTransaction from '__test__/utils/buildTransaction';
import { Category, CoreTransaction } from 'types/transaction';

test('shows loading indicator while transactions are loading', () => {
  const mocks = [buildApiTransactionsMock()];
  render(
    <TestGreenbacksProvider mocks={mocks} now="2020-07-01" route="/widgets">
      <Greenbacks />
    </TestGreenbacksProvider>,
  );
  const loadingIndicator = screen.getByTestId(
    'loading-indicator-monthly-spending-by-tag',
  );
  expect(loadingIndicator).toBeInTheDocument();
});

test('groups transactions by tag', async () => {
  const apiMocks = [
    buildApiTransactionsMock({
      endDate: '2020-01-31',
      startDate: '2020-01-01',
      transactions: [
        buildTransaction({
          amount: 100,
          name: 'first name',
        }),
        buildTransaction({
          amount: 100,
          name: 'first name',
        }),
        buildTransaction({
          amount: 100,
          name: 'second name',
        }),
        buildTransaction({
          amount: 100,
          name: 'second name',
        }),
        buildTransaction({
          amount: 100,
          name: 'second name',
        }),
        buildTransaction({
          amount: 100,
          name: 'third name',
        }),
        buildTransaction({
          amount: 100,
          name: 'hidden',
        }),
      ],
    }),
    buildFiltersMock({
      filters: [
        buildFilter({
          categoryToAssign: Category.Spending,
          id: 'test-filter-id-1',
          matchers: [
            {
              expectedValue: 'first name',
              property: 'name' as keyof CoreTransaction,
            },
          ],
          tagToAssign: 'first tag',
        }),
        buildFilter({
          categoryToAssign: Category.Spending,
          id: 'test-filter-id-1',
          matchers: [
            {
              expectedValue: 'second name',
              property: 'name' as keyof CoreTransaction,
            },
          ],
          tagToAssign: 'second tag',
        }),
        buildFilter({
          categoryToAssign: Category.Spending,
          id: 'test-filter-id-1',
          matchers: [
            {
              expectedValue: 'third name',
              property: 'name' as keyof CoreTransaction,
            },
          ],
          tagToAssign: 'third tag',
        }),
        buildFilter({
          categoryToAssign: Category.Hidden,
          matchers: [
            buildMatcher({ expectedValue: 'hidden', property: 'name' }),
          ],
        }),
      ],
    }),
  ];
  render(
    <TestGreenbacksProvider mocks={apiMocks} now="2020-01-01" route="/widgets">
      <Greenbacks />
    </TestGreenbacksProvider>,
  );
  const { findAllByRole } = within(
    await screen.findByTestId('section-monthly-spending-by-tag'),
  );
  const items = await findAllByRole('listitem');
  expect(items[0]).toHaveTextContent(/second tag: \$3.00/);
  expect(items[1]).toHaveTextContent(/first tag: \$2.00/);
  expect(items[2]).toHaveTextContent(/third tag: \$1.00/);
  expect(items).toHaveLength(3);
  const graph = await screen.findByTestId('monthly-spending-by-tag-graph');
  screen.debug(graph);
  expect(graph).toHaveAttribute('data-tag-first-tag', '200');
  expect(graph).toHaveAttribute('data-tag-second-tag', '300');
  expect(graph).toHaveAttribute('data-tag-third-tag', '100');
});

test('groups untagged transactions', async () => {
  const apiMocks = [
    buildApiTransactionsMock({
      endDate: '2020-01-31',
      startDate: '2020-01-01',
      transactions: [
        buildTransaction({
          amount: 100,
          name: 'first name',
        }),
        buildTransaction({
          amount: 100,
          name: 'second name',
        }),
      ],
    }),
    buildFiltersMock({
      filters: [
        buildFilter({
          categoryToAssign: Category.Spending,
          id: 'test-filter-id-1',
          matchers: [
            {
              expectedValue: 'first name',
              property: 'name' as keyof CoreTransaction,
            },
          ],
        }),
        buildFilter({
          categoryToAssign: Category.Spending,
          id: 'test-filter-id-1',
          matchers: [
            {
              expectedValue: 'second name',
              property: 'name' as keyof CoreTransaction,
            },
          ],
        }),
      ],
    }),
  ];
  render(
    <TestGreenbacksProvider mocks={apiMocks} now="2020-01-01" route="/widgets">
      <Greenbacks />
    </TestGreenbacksProvider>,
  );
  const { getByText } = within(
    await screen.findByTestId('section-monthly-spending-by-tag'),
  );
  expect(getByText(/Untagged: \$2.00/)).toBeVisible();
  const graph = await screen.findByTestId('monthly-spending-by-tag-graph');
  expect(graph).toHaveAttribute('data-tag-untagged', '200');
});

test('shows current month when no month is present in route', async () => {
  const apiMocks = [
    buildApiTransactionsMock({
      endDate: '2020-01-31',
      startDate: '2020-01-01',
      transactions: [
        buildTransaction({
          amount: 100,
          name: 'test name',
        }),
      ],
    }),
    buildFiltersMock({
      filters: [
        buildFilter({
          categoryToAssign: Category.Spending,
          id: 'test-filter-id',
          matchers: [
            {
              expectedValue: 'test name',
              property: 'name' as keyof CoreTransaction,
            },
          ],
          tagToAssign: 'test tag',
        }),
      ],
    }),
  ];
  render(
    <TestGreenbacksProvider mocks={apiMocks} now="2020-01-01" route="/widgets">
      <Greenbacks />
    </TestGreenbacksProvider>,
  );
  const container = await screen.findByTestId(
    'section-monthly-spending-by-tag',
  );
  expect(within(container).getByText(/test tag/)).toBeVisible();
});
