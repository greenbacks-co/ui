import React from 'react';
import styled from 'styled-components';

import { Icon, IconType } from 'components/Icon';
import noop from 'utils/noop';
import { Panel, PanelItem } from './atoms/Panel';
import { Row } from './atoms/Row';
import { Text } from './atoms/Text';
import { Button, ButtonStyle } from './atoms/Button';

export function Modal({
  children,
  onClose = noop,
  title,
}: {
  children?: React.ReactNode;
  onClose?: () => void;
  title?: string;
}): React.ReactElement {
  return (
    <ModalWrapper>
      <Background onClick={onClose} />
      <ContentWrapper>
        <Panel>
          <PanelItem hasBottomBorder>
            <Row>
              <Text isBold>{title}</Text>
              <Button onClick={onClose} style={ButtonStyle.Unstyled}>
                <Icon icon={IconType.X} />
              </Button>
            </Row>
          </PanelItem>
          <PanelItem>{children}</PanelItem>
        </Panel>
      </ContentWrapper>
    </ModalWrapper>
  );
}

const ModalWrapper = styled.div`
  align-items: start;
  display: flex;
  height: 100vh;
  justify-content: center;
  left: 0;
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 1;
`;

const Background = styled.div`
  background-color: rgba(0, 0, 0, 0.15);
  height: 100%;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1;
`;

const ContentWrapper = styled.div`
  margin-top: 64px;
  position: sticky;
  z-index: 2;
`;
