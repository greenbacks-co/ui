import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { Modal } from './Modal';

const meta: Meta<typeof Modal> = {
  args: {
    children: 'Test text for modal body.',
    onClose: fn(),
    title: 'Modal',
  },
  component: Modal,
  parameters: {
    layout: 'fullscreen',
  },
  title: 'Atoms/Modal',
};

type Story = StoryObj<typeof Modal>;

export const Default: Story = {};

export const NoTitle: Story = {
  args: { title: undefined },
};

export const NoBody: Story = {
  args: { children: undefined },
};

export default meta;
