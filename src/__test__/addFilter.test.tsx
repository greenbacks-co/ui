import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Greenbacks from 'components/Greenbacks';
import { TestGreenbacksProvider } from 'context/Greenbacks';
import buildApiTransactionsMock from '__test__/utils/buildApiTransactionsMock';
import buildTransaction from '__test__/utils/buildTransaction';

test('adds spending filter', async () => {
  const apiMocks = [
    buildApiTransactionsMock({
      endDate: '2020-06-30',
      startDate: '2020-01-01',
      transactions: [
        buildTransaction({
          amount: 600,
          name: 'test name',
        }),
      ],
    }),
  ];
  render(
    <TestGreenbacksProvider mocks={apiMocks} now="2020-07-01">
      <Greenbacks />
    </TestGreenbacksProvider>
  );
  const { getByRole } = within(
    await screen.findByTestId('section-untagged-spending')
  );
  userEvent.click(getByRole('button'));
  userEvent.click(
    getByRole('radio', { name: "Transactions with name 'test name'" })
  );
  userEvent.click(getByRole('radio', { name: 'Spending' }));
  userEvent.type(
    await screen.findByRole('textbox', { name: 'Tag' }),
    'test tag'
  );
  userEvent.click(screen.getByRole('button', { name: 'Add filter' }));
  const { getByText } = within(
    screen.getByTestId('section-average-spending-by-tag')
  );
  expect(getByText(/test tag: \$1.00/)).toBeVisible();
});

test('adds earning filter', async () => {
  const apiMocks = [
    buildApiTransactionsMock({
      endDate: '2020-06-30',
      startDate: '2020-01-01',
      transactions: [
        buildTransaction({
          amount: 600,
          name: 'test name',
        }),
      ],
    }),
  ];
  render(
    <TestGreenbacksProvider mocks={apiMocks} now="2020-07-01">
      <Greenbacks />
    </TestGreenbacksProvider>
  );
  const { getByRole } = within(
    await screen.findByTestId('section-untagged-spending')
  );
  userEvent.click(getByRole('button'));
  userEvent.click(
    getByRole('radio', { name: "Transactions with name 'test name'" })
  );
  userEvent.click(getByRole('radio', { name: 'Earning' }));
  userEvent.type(
    await screen.findByRole('textbox', { name: 'Tag' }),
    'test tag'
  );
  userEvent.click(screen.getByRole('button', { name: 'Add filter' }));
  expect(screen.getByTestId('average-monthly-earnings')).toHaveTextContent(
    /\$1.00/
  );
});

test('adds saving filter', async () => {
  const apiMocks = [
    buildApiTransactionsMock({
      endDate: '2020-06-30',
      startDate: '2020-01-01',
      transactions: [
        buildTransaction({
          amount: 600,
          name: 'test name',
        }),
      ],
    }),
  ];
  render(
    <TestGreenbacksProvider mocks={apiMocks} now="2020-07-01">
      <Greenbacks />
    </TestGreenbacksProvider>
  );
  const { getByRole } = within(
    await screen.findByTestId('section-untagged-spending')
  );
  userEvent.click(getByRole('button'));
  userEvent.click(
    getByRole('radio', { name: "Transactions with name 'test name'" })
  );
  userEvent.click(getByRole('radio', { name: 'Saving' }));
  userEvent.type(
    await screen.findByRole('textbox', { name: 'Tag' }),
    'test tag'
  );
  userEvent.click(screen.getByRole('button', { name: 'Add filter' }));
  expect(screen.getByTestId('average-monthly-savings')).toHaveTextContent(
    /\$1.00/
  );
});
