import React, { FC } from 'react';
import styled, { css } from 'styled-components';

import { ReactComponent as UnstyledCog } from 'assets/icons/cog.svg';
import noop from 'utils/noop';

export const Button: FC<{
  area?: string;
  isDisabled?: boolean;
  isFullWidth?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
  style?: ButtonStyle;
}> = ({
  area,
  children,
  isDisabled = false,
  isFullWidth = false,
  isLoading = false,
  onClick = noop,
  style = ButtonStyle.Primary,
}) => (
  <StyledButton
    area={area}
    disabled={isDisabled || isLoading}
    $isFullWidth={isFullWidth}
    onClick={onClick}
    $style={style}
    type="button"
  >
    {isLoading && <Cog />}
    {!isLoading && children}
  </StyledButton>
);

const Cog = styled(UnstyledCog)`
  animation: spin 2s linear infinite;
  width: 20px;

  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
`;

export enum ButtonStyle {
  Primary,
  Secondary,
  Text,
  Unstyled,
}

interface StyleProps {
  area?: string;
  $isFullWidth: boolean;
  $style: ButtonStyle;
}

const StyledButton = styled.button<StyleProps>`
  ${({ $style }) => getStyle({ style: $style })}
`;

function getStyle({ style }: { style: ButtonStyle }) {
  switch (style) {
    case ButtonStyle.Secondary:
      return secondaryStyle;
    case ButtonStyle.Text:
      return textStyle;
    case ButtonStyle.Unstyled:
      return unstyledStyle;
    case ButtonStyle.Primary:
    default:
      return primaryStyle;
  }
}

const sharedStyles = css<StyleProps>`
  ${({ area }) => area && `grid-area: ${area};`}
  color: #013220;
  cursor: pointer;
  font-family: 'Lora', serif;
  font-size: 1rem;
  width: ${({ $isFullWidth }) => ($isFullWidth ? '100%' : 'max-content')};
`;

const primaryStyle = css<StyleProps>`
  ${sharedStyles}
  background-color: #d0f0c0;
  border: none;
  border-radius: 4px;
  padding: 4px 32px;
`;

const secondaryStyle = css<StyleProps>`
  ${sharedStyles}
  background: none;
  border: solid lightgrey 1px;
  border-radius: 4px;
  padding: 4px 32px;
`;

const textStyle = css<StyleProps>`
  ${sharedStyles}
  background: none;
  border: none;
  font: inherit;
  padding: 0;
  text-decoration: underline;
`;

const unstyledStyle = css<StyleProps>`
  ${sharedStyles}
  background: none;
  border: none;
  color: inherit;
  font: inherit;
  outline: inherit;
  padding: 0;
  text-align: inherit;
`;

export default Button;
