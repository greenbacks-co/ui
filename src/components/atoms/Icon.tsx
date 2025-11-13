import React, { FC } from 'react';

import { ReactComponent as ArrowRightIcon } from 'assets/icons/arrow-right.svg';
import { ReactComponent as ArrowRightCircleIcon } from 'assets/icons/arrow-right-circle.svg';
import { ReactComponent as ChevronLeftIcon } from 'assets/icons/chevron-left.svg';
import { ReactComponent as ChevronRightIcon } from 'assets/icons/chevron-right.svg';
import { ReactComponent as CogIcon } from 'assets/icons/cog.svg';
import { ReactComponent as FilterIcon } from 'assets/icons/filter.svg';
import { ReactComponent as MinusIcon } from 'assets/icons/minus.svg';
import { ReactComponent as PlusIcon } from 'assets/icons/plus.svg';
import { ReactComponent as TagIcon } from 'assets/icons/tag.svg';
import { ReactComponent as XIcon } from 'assets/icons/x.svg';
import styled from 'utils/styled';

export const Icon: FC<{ icon: IconType }> = ({ icon }) => (
  <Wrapper>
    <InnerIcon icon={icon} />
  </Wrapper>
);

export enum IconType {
  ArrowRight = 'arrow-right',
  ArrowRightCircle = 'arrow-right-circle',
  ChevronLeft = 'chevron-left',
  ChevronRight = 'chevron-right',
  Cog = 'cog',
  Filter = 'filter',
  Minus = 'minus',
  Plus = 'plus',
  Tag = 'tag',
  X = 'x',
}

const Wrapper = styled.div`
  color: #013220;
  height: 14px;
  width: 14px;

  & > svg {
    height: 100%;
    stroke: currentColor;
    width: 100%;
  }
`;

function InnerIcon({ icon }: { icon: IconType }): React.ReactElement {
  switch (icon) {
    case IconType.ArrowRight:
      return <ArrowRightIcon />;
    case IconType.ArrowRightCircle:
      return <ArrowRightCircleIcon />;
    case IconType.ChevronLeft:
      return <ChevronLeftIcon />;
    case IconType.ChevronRight:
      return <ChevronRightIcon />;
    case IconType.Cog:
      return <CogIcon />;
    case IconType.Filter:
      return <FilterIcon />;
    case IconType.Minus:
      return <MinusIcon />;
    case IconType.Plus:
      return <PlusIcon />;
    case IconType.Tag:
      return <TagIcon />;
    case IconType.X:
    default:
      return <XIcon />;
  }
}

export default Icon;
