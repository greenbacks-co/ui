import React, { FC } from 'react';
import styled from 'styled-components';

import { basicFontStyles } from './Text';

const Label: FC<{ forId?: string }> = ({ children, forId }) => (
  <StyledLabel htmlFor={forId}>{children}</StyledLabel>
);

const StyledLabel = styled.label`
  ${basicFontStyles}
  display: inline-block;
  padding: 4px 0;
`;

export default Label;
