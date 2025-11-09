import { useLocation } from 'react-router-dom';

import useNow from 'hooks/useNow';
import datetime from 'utils/datetime';
import getMonth from 'utils/getMonth';

const useMonth = (): {
  daysInMonth: number;
  endDate: string;
  isCurrent: boolean;
  iso: string;
  nextMonth: string;
  previousMonth: string;
  readable: string;
  startDate: string;
} => {
  const { routeMonth } = useRouteMonth();
  const { now } = useNow();
  const month = routeMonth || now;
  const isCurrent =
    !routeMonth || routeMonth.startOf('month').equals(now.startOf('month'));
  const {
    daysInMonth,
    firstDay,
    iso: currentMonth,
    lastDay,
    readable: readableMonth,
  } = getMonth({
    datetime: month,
  });
  const { iso: nextMonth } = getMonth({ datetime: month, offset: 1 });
  const { iso: previousMonth } = getMonth({ datetime: month, offset: -1 });
  return {
    daysInMonth,
    endDate: lastDay,
    isCurrent,
    iso: currentMonth,
    nextMonth,
    previousMonth,
    readable: readableMonth,
    startDate: firstDay,
  };
};

const useRouteMonth = (): { routeMonth?: datetime } => {
  const { search } = useLocation();
  const month = new URLSearchParams(search).get('month');
  if (!month) return {};
  return { routeMonth: datetime.fromISO(month) };
};

export default useMonth;
