import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import styled from 'styled-components';

import { Row, Space } from './Row';

const meta: Meta<typeof Row> = {
  args: {
    space: undefined,
  },
  argTypes: {
    space: {
      options: Object.values(Space),
      control: 'radio',
    },
  },
  component: Row,
  parameters: {
    layout: 'centered',
  },
  title: 'Atoms/Row',
};

type Story = StoryObj<typeof Row>;

export const TwoItems: Story = {
  render: ({ space }) => (
    <Wrapper>
      <Row space={space}>
        <p>first</p>
        <p>second</p>
      </Row>
    </Wrapper>
  ),
};

export const ThreeItems: Story = {
  render: ({ space }) => (
    <Wrapper>
      <Row space={space}>
        <p>first</p>
        <p>second</p>
        <p>third</p>
      </Row>
    </Wrapper>
  ),
};

const Wrapper = styled.div`
  border: solid lightgrey 1px;
  border-radius: 4px;
  padding: 0 16px;
  width: 300px;
`;

export default meta;
