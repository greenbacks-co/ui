import type { Meta, StoryObj } from '@storybook/react';

import { Heirarchy, Size, Text } from './Text';

const meta: Meta<typeof Text> = {
  args: {
    children: 'test',
    heirarchy: undefined,
    isBold: undefined,
    size: undefined,
  },
  argTypes: {
    heirarchy: {
      options: Object.values(Heirarchy),
      control: 'radio',
    },
    size: {
      options: Object.values(Size),
      control: 'radio',
    },
  },
  component: Text,
  parameters: {
    layout: 'centered',
  },
  title: 'Atoms/Text',
};

type Story = StoryObj<typeof Text>;

export const Small: Story = {
  args: {
    size: Size.Small,
  },
};

export const Medium: Story = {
  args: {
    size: Size.Medium,
  },
};

export const Large: Story = {
  args: {
    size: Size.Large,
  },
};

export const Bold: Story = {
  args: {
    isBold: true,
  },
};

export default meta;
