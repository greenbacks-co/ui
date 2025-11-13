import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { List, Item } from './List';

const meta: Meta<typeof List> = {
  args: {
    hasOutsideBorder: undefined,
    hasRoundedBottomCorners: undefined,
    hasRoundedTopCorners: undefined,
    isIndented: undefined,
    isInset: undefined,
  },
  component: List,
  parameters: {
    layout: 'centered',
  },
  title: 'Atoms/List',
};

type Story = StoryObj<typeof List>;

export const Default: Story = {
  render: () => (
    <List>
      <Item>first</Item>
      <Item>second</Item>
      <Item>third</Item>
    </List>
  ),
};

export const NoOutsideBorder: Story = {
  render: () => (
    <List hasOutsideBorder={false}>
      <Item>first</Item>
      <Item>second</Item>
      <Item>third</Item>
    </List>
  ),
};

export const Inset: Story = {
  render: () => (
    <List isInset>
      <Item>first</Item>
      <Item>second</Item>
      <Item>third</Item>
    </List>
  ),
};

export const Indented: Story = {
  render: () => (
    <List isIndented>
      <Item>first</Item>
      <Item>second</Item>
      <Item>third</Item>
    </List>
  ),
};

export default meta;
