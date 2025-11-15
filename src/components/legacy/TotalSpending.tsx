import React, { FunctionComponent } from 'react';

import datetime from 'utils/datetime';
import styled from 'utils/styled';

const now = datetime.now();
const defaultCurrentMonth = `${now.year}-${now.month}`;

const TotalSpending: FunctionComponent<Props> = ({
  amount = 0,
  currentMonth = defaultCurrentMonth,
  month = defaultCurrentMonth,
}: Props) => (
  <Wrapper aria-label="total-spending">
    <Amount data-testid="total-spending-amount">
      {currencyFormatter.format(amount / 100)}
    </Amount>
    <Month data-testid="total-spending-text">
      {generateMonthText({ currentMonth, month })}
    </Month>
  </Wrapper>
);

interface Props {
  amount?: number;
  currentMonth?: string;
  month?: string;
}

TotalSpending.defaultProps = {
  amount: 0,
  currentMonth: defaultCurrentMonth,
  month: defaultCurrentMonth,
};

const Wrapper = styled.article`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-bottom: 100px;
`;

const Amount = styled.p`
  font-size: 4rem;
  margin: 0;
  margin-bottom: 20px;
`;

const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'CAD',
});

const Month = styled.p`
  font-size: 0.9rem;
  margin: 0;
`;

const generateMonthText = ({
  currentMonth,
  month,
}: {
  currentMonth: string;
  month: string;
}) => {
  const [year, monthNumber] = month.split('-');
  const [currentYear, currentMonthNumber] = currentMonth.split('-');
  if (year === currentYear && monthNumber === currentMonthNumber)
    return 'Spent so far this month';
  if (isLastMonth({ currentMonthNumber, currentYear, monthNumber, year }))
    return 'Spent last month';
  const monthName = monthNamesByNumber[monthNumber];
  if (currentYear === year) return `Spent in ${monthName}`;
  return `Spent in ${monthName}, ${year}`;
};

const monthNamesByNumber: Record<string, string> = {
  '01': 'January',
  '02': 'February',
  '03': 'March',
  '04': 'April',
  '05': 'May',
  '06': 'June',
  '07': 'July',
  '08': 'August',
  '09': 'September',
  '10': 'October',
  '11': 'November',
  '12': 'December',
};

const isLastMonth = ({
  currentMonthNumber,
  currentYear,
  monthNumber,
  year,
}: {
  currentMonthNumber: string;
  currentYear: string;
  monthNumber: string;
  year: string;
}) => {
  const parsedCurrentMonthNumber = parseInt(currentMonthNumber, 10);
  const parsedCurrentYear = parseInt(currentYear, 10);
  const parsedMonthNumber = parseInt(monthNumber, 10);
  const parsedYear = parseInt(year, 10);
  if (
    parsedYear === parsedCurrentYear &&
    parsedMonthNumber === parsedCurrentMonthNumber - 1
  )
    return true;
  if (
    parsedYear === parsedCurrentYear - 1 &&
    parsedMonthNumber === 12 &&
    parsedCurrentMonthNumber === 1
  )
    return true;
  return false;
};

export default TotalSpending;
