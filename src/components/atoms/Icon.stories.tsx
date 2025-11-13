import type { Meta, StoryObj } from '@storybook/react';

import Icon, { IconType } from './Icon';

const meta: Meta<typeof Icon> = {
  args: {
    icon: undefined,
  },
  argTypes: {
    icon: {
      options: Object.values(IconType),
      control: 'radio',
    },
  },
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  title: 'Atoms/Icon',
};

type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: {
    icon: IconType.Cog,
  },
};

export default meta;
