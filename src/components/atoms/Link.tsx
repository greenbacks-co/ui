import React, { FC } from 'react';
import styled, { css } from 'styled-components';
import { Link as ExternalLink } from 'react-router-dom';

export const Link: FC<{ href: string; id?: string; style?: LinkStyle }> = ({
  children,
  href,
  id,
  style = LinkStyle.Default,
}) => (
  <StyledLink id={id} to={href} $style={style}>
    {children}
  </StyledLink>
);

export enum LinkStyle {
  Default = 'default',
  Unstyled = 'unstyled',
}

const StyledLink = styled(ExternalLink)<StyleProps>`
  ${({ $style }) => getStyle({ style: $style })}
`;

interface StyleProps {
  $style: LinkStyle;
}

function getStyle({ style }: { style: LinkStyle }) {
  switch (style) {
    case LinkStyle.Unstyled:
      return unstyledStyle;
    case LinkStyle.Default:
    default:
      return defaultStyle;
  }
}

const sharedStyles = css<StyleProps>`
  color: #013220;
  font-family: 'Lora', serif;
  font-size: 1rem;
`;

const defaultStyle = css<StyleProps>`
  ${sharedStyles}
`;

const unstyledStyle = css<StyleProps>`
  ${sharedStyles}
  color: inherit;
  text-decoration: none;
`;

export default Link;
