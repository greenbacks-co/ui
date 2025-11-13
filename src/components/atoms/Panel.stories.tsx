import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { List, Item } from './List';
import { Panel, PanelItem } from './Panel';

const meta: Meta<typeof Panel> = {
  args: {},
  component: Panel,
  parameters: {
    layout: 'centered',
  },
  title: 'Atom./atoms/Panel',
};

type Story = StoryObj<typeof Panel>;

export const Default: Story = {
  render: () => (
    <Panel>
      <PanelItem>
        <span>test</span>
        <span>test</span>
      </PanelItem>
      <PanelItem>
        <span>test</span>
      </PanelItem>
    </Panel>
  ),
};

export const ListInBody: Story = {
  render: () => (
    <Panel>
      <PanelItem>
        <span>test</span>
        <span>test</span>
      </PanelItem>
      <List hasOutsideBorder={false}>
        <Item>first</Item>
        <Item>second</Item>
        <Item>third</Item>
      </List>
    </Panel>
  ),
};

export const NoBorder: Story = {
  render: () => (
    <Panel hasBorder={false}>
      <PanelItem>
        <span>test</span>
        <span>test</span>
      </PanelItem>
      <PanelItem>
        <span>test</span>
      </PanelItem>
    </Panel>
  ),
};

export default meta;
