import React, { ReactElement } from 'react';

import { Cashflow, Totals } from './NewCashflow';

export function CashflowTimeline({
  totals = [],
}: {
  totals?: Totals[];
}): ReactElement {
  return <Cashflow totals={totals} />;
}
