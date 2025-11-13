import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import styled from 'styled-components';

import { Button, ButtonStyle } from './Button';

const meta: Meta<typeof Button> = {
  args: {
    children: 'button',
    isDisabled: undefined,
    onClick: fn(),
    style: undefined,
  },
  component: Button,
  parameters: {
    layout: 'centered',
  },
  title: 'Atoms/Button',
};

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    style: ButtonStyle.Primary,
  },
};

export const Secondary: Story = {
  args: {
    style: ButtonStyle.Secondary,
  },
};

export const Text: Story = {
  args: {
    style: ButtonStyle.Text,
  },
};

export const Unstyled: Story = {
  render: () => (
    <>
      <p>button</p>
      <Button onClick={fn()} style={ButtonStyle.Unstyled}>
        <Wrapper>
          <p>first</p>
          <p>second</p>
        </Wrapper>
      </Button>
      <p>no button</p>
      <Wrapper>
        <p>first</p>
        <p>second</p>
      </Wrapper>
    </>
  ),
};

const Wrapper = styled.div`
  border: solid lightgrey 1px;
  width: 400px;
`;

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export default meta;
