import React, { FC } from 'react';

import Badge, { Props as BadgeProps } from 'components/Badge';
import useCurrencyFormatter from 'hooks/useCurrencyFormatter';

const AmountBadge: FC<Props> = ({ amount, ...rest }) => {
  const { format } = useCurrencyFormatter();

  return <Badge {...rest}>{format({ value: amount })}</Badge>;
};

interface Props extends BadgeProps {
  amount?: number;
}

export default AmountBadge;
