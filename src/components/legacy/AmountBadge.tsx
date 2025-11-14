import React, { FC } from 'react';

import useCurrencyFormatter from 'hooks/useCurrencyFormatter';
import Badge, { Props as BadgeProps } from './Badge';

const AmountBadge: FC<Props> = ({ amount, ...rest }) => {
  const { format } = useCurrencyFormatter();

  return <Badge {...rest}>{format({ value: amount })}</Badge>;
};

interface Props extends BadgeProps {
  amount?: number;
}

export default AmountBadge;
