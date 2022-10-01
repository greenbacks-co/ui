import React from 'react';
import { render, screen, within } from '@testing-library/react';

import Greenbacks from 'components/Greenbacks';
import { TestGreenbacksProvider } from 'context/Greenbacks';
import buildApiTransactionsMock from '__test__/utils/buildApiTransactionsMock';
import buildFilter, { buildMatcher } from '__test__/utils/buildFilter';
import buildTransaction from '__test__/utils/buildTransaction';
import { Category } from 'types/transaction';

test('shows untagged earning', async () => {
  const apiMocks = [
    buildApiTransactionsMock({
      endDate: '2020-06-30',
      startDate: '2020-01-01',
      transactions: [
        buildTransaction({
          amount: -100,
          datetime: '2020-01-01',
          id: 'first-id',
          merchant: 'first merchant',
          name: 'first name',
        }),
        buildTransaction({
          amount: -200,
          datetime: '2020-01-02',
          id: 'second-id',
          merchant: 'second merchant',
          name: 'second name',
        }),
      ],
    }),
  ];
  render(
    <TestGreenbacksProvider mocks={apiMocks} now="2020-07-01">
      <Greenbacks />
    </TestGreenbacksProvider>
  );
  const { getAllByRole } = within(
    await screen.findByTestId('section-untagged-earning')
  );
  const items = getAllByRole('listitem');
  expect(items[0]).toHaveTextContent(
    '$2.00 (Credit)—second merchant (second name)—2020-01-02'
  );
  expect(items[1]).toHaveTextContent(
    '$1.00 (Credit)—first merchant (first name)—2020-01-01'
  );
  expect(items).toHaveLength(2);
});

test('excludes tagged earning', async () => {
  const apiMocks = [
    buildApiTransactionsMock({
      endDate: '2020-06-30',
      startDate: '2020-01-01',
      transactions: [
        buildTransaction({
          amount: -100,
          datetime: '2020-01-01',
          id: 'first-id',
          merchant: 'first merchant',
          name: 'first name',
        }),
        buildTransaction({
          amount: -200,
          datetime: '2020-01-02',
          id: 'second-id',
          merchant: 'second merchant',
          name: 'second name',
        }),
      ],
    }),
  ];
  const filters = [
    buildFilter({
      categoryToAssign: Category.Earning,
      matchers: [
        buildMatcher({
          expectedValue: 'first name',
          property: 'name',
        }),
      ],
      tagToAssign: 'test tag',
    }),
  ];
  render(
    <TestGreenbacksProvider
      mocks={apiMocks}
      now="2020-07-01"
      oneTransactionFilters={filters}
    >
      <Greenbacks />
    </TestGreenbacksProvider>
  );
  const { getAllByRole } = within(
    await screen.findByTestId('section-untagged-earning')
  );
  const items = getAllByRole('listitem');
  expect(items[0]).toHaveTextContent(
    '$2.00 (Credit)—second merchant (second name)—2020-01-02'
  );
  expect(items).toHaveLength(1);
});

test('excludes spending', async () => {
  const apiMocks = [
    buildApiTransactionsMock({
      endDate: '2020-06-30',
      startDate: '2020-01-01',
      transactions: [
        buildTransaction({
          amount: -100,
          datetime: '2020-01-01',
          id: 'first-id',
          merchant: 'first merchant',
          name: 'first name',
        }),
        buildTransaction({
          amount: -200,
          datetime: '2020-01-02',
          id: 'second-id',
          merchant: 'second merchant',
          name: 'second name',
        }),
      ],
    }),
  ];
  const filters = [
    buildFilter({
      categoryToAssign: Category.Spending,
      matchers: [
        buildMatcher({
          expectedValue: 'first name',
          property: 'name',
        }),
      ],
    }),
  ];
  render(
    <TestGreenbacksProvider
      mocks={apiMocks}
      now="2020-07-01"
      oneTransactionFilters={filters}
    >
      <Greenbacks />
    </TestGreenbacksProvider>
  );
  const { getAllByRole } = within(
    await screen.findByTestId('section-untagged-earning')
  );
  const items = getAllByRole('listitem');
  expect(items[0]).toHaveTextContent(
    '$2.00 (Credit)—second merchant (second name)—2020-01-02'
  );
  expect(items).toHaveLength(1);
});

test('excludes saving', async () => {
  const apiMocks = [
    buildApiTransactionsMock({
      endDate: '2020-06-30',
      startDate: '2020-01-01',
      transactions: [
        buildTransaction({
          amount: -100,
          datetime: '2020-01-01',
          id: 'first-id',
          merchant: 'first merchant',
          name: 'first name',
        }),
        buildTransaction({
          amount: -200,
          datetime: '2020-01-02',
          id: 'second-id',
          merchant: 'second merchant',
          name: 'second name',
        }),
      ],
    }),
  ];
  const filters = [
    buildFilter({
      categoryToAssign: Category.Saving,
      matchers: [
        buildMatcher({
          expectedValue: 'first name',
          property: 'name',
        }),
      ],
    }),
  ];
  render(
    <TestGreenbacksProvider
      mocks={apiMocks}
      now="2020-07-01"
      oneTransactionFilters={filters}
    >
      <Greenbacks />
    </TestGreenbacksProvider>
  );
  const { getAllByRole } = within(
    await screen.findByTestId('section-untagged-earning')
  );
  const items = getAllByRole('listitem');
  expect(items[0]).toHaveTextContent(
    '$2.00 (Credit)—second merchant (second name)—2020-01-02'
  );
  expect(items).toHaveLength(1);
});

test('excludes hidden transactions', async () => {
  const apiMocks = [
    buildApiTransactionsMock({
      endDate: '2020-06-30',
      startDate: '2020-01-01',
      transactions: [
        buildTransaction({
          amount: -100,
          datetime: '2020-01-01',
          id: 'first-id',
          merchant: 'first merchant',
          name: 'first name',
        }),
        buildTransaction({
          amount: -200,
          datetime: '2020-01-02',
          id: 'second-id',
          merchant: 'second merchant',
          name: 'second name',
        }),
      ],
    }),
  ];
  const filters = [
    buildFilter({
      categoryToAssign: Category.Hidden,
      matchers: [
        buildMatcher({
          expectedValue: 'first name',
          property: 'name',
        }),
      ],
    }),
  ];
  render(
    <TestGreenbacksProvider
      mocks={apiMocks}
      now="2020-07-01"
      oneTransactionFilters={filters}
    >
      <Greenbacks />
    </TestGreenbacksProvider>
  );
  const { getAllByRole } = within(
    await screen.findByTestId('section-untagged-earning')
  );
  const items = getAllByRole('listitem');
  expect(items[0]).toHaveTextContent(
    '$2.00 (Credit)—second merchant (second name)—2020-01-02'
  );
  expect(items).toHaveLength(1);
});

test('section is not present while transactions are loading', async () => {
  render(
    <TestGreenbacksProvider>
      <Greenbacks />
    </TestGreenbacksProvider>
  );
  expect(
    screen.queryByTestId('section-untagged-earning')
  ).not.toBeInTheDocument();
});

test('section is not present when no untagged transactions exist', async () => {
  const apiMocks = [
    buildApiTransactionsMock({
      endDate: '2020-01-31',
      startDate: '2020-01-01',
      transactions: [
        buildTransaction({
          amount: -100,
          name: 'test name',
        }),
      ],
    }),
  ];
  const filters = [
    buildFilter({
      categoryToAssign: Category.Earning,
      matchers: [
        buildMatcher({
          expectedValue: 'test name',
          property: 'name',
        }),
      ],
      tagToAssign: 'test tag',
    }),
  ];
  render(
    <TestGreenbacksProvider mocks={apiMocks} oneTransactionFilters={filters}>
      <Greenbacks />
    </TestGreenbacksProvider>
  );
  await screen.findByText(/test name/); // ensure transactions have loaded
  expect(
    screen.queryByTestId('section-untagged-earning')
  ).not.toBeInTheDocument();
});
