import styled from 'utils/styled';

export const Panel = styled.div<{
  area?: string;
  hasBorder?: boolean;
  hasTopBorder?: boolean;
}>`
  ${({ area }) => area && `grid-area: ${area};`}

  background-color: white;

  ${({ hasBorder = true }) =>
    hasBorder &&
    `
      border: solid lightgrey 1px;
      border-radius: 4px;
  `}

  ${({ hasTopBorder = false }) =>
    hasTopBorder && 'border-top: solid lightgrey 1px;'}

  height: max-content;
  min-width: 250px;
`;

export const PanelItem = styled.div<{
  hasBottomBorder?: boolean;
  hasPadding?: boolean;
  hasTopBorder?: boolean;
  isInset?: boolean;
}>`
  padding: ${({ hasPadding = true }) => (hasPadding ? '8px 16px' : '0')};
  ${({ hasBottomBorder = false }) =>
    hasBottomBorder && 'border-bottom: solid lightgrey 1px;'}
  ${({ hasTopBorder = false }) =>
    hasTopBorder && 'border-top: solid lightgrey 1px;'}
  ${({ isInset = false }) =>
    isInset &&
    `
      background-color: #f9f9f9;
      box-shadow: grey 0px 3px 4px -4px inset;
  `}
`;
