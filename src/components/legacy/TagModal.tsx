import React, { FC, useContext } from 'react';

import AddFilter from './AddFilter';
import TagModalContext from 'context/TagModal';
import styled from 'utils/styled';
import Button from '../atoms/Button';

const TagModal: FC = () => {
  const { closeModal, transactionToTag } = useContext(TagModalContext);
  if (!transactionToTag) return null;
  return (
    <Modal>
      <Content>
        <h3>Tag transaction</h3>
        <Button onClick={() => closeModal()}>close</Button>
        <AddFilter transaction={transactionToTag} />
      </Content>
    </Modal>
  );
};

const Modal = styled.div`
  background-color: rgba(0, 0, 0, 0.2);
  height: 100vh;
  left: 0;
  overflow: auto;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1;
`;

const Content = styled.div`
  background-color: white;
  border-radius: 8px;
  margin: 20px;
  padding: 20px;
`;

export default TagModal;
