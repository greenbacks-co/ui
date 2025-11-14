import React, { FC } from 'react';

import Badge, { Props as BadgeProps } from './Badge';

const PercentBadge: FC<Props> = ({ percent, ...rest }) => {
  const text = percent ? `${Math.round(percent * 100)}%` : '-';
  return <Badge {...rest}>{text}</Badge>;
};

interface Props extends BadgeProps {
  percent?: number;
}

export default PercentBadge;
