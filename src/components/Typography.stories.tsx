import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import styled from 'styled-components';

import { Heirarchy, Size, Text } from './atoms/Text';

const meta: Meta = {
  parameters: {
    layout: 'centered',
  },
  title: 'Utilities/Typography',
};

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <>
      <h3>Size & Heirarchy</h3>
      <Table cellPadding="0" cellSpacing="0">
        <tr>
          <th> </th>
          {Object.values(Size).map((size) => (
            <th>{size}</th>
          ))}
        </tr>
        {Object.values(Heirarchy).map((heirarchy) => (
          <tr>
            <th>{heirarchy}</th>
            {Object.values(Size).map((size) => (
              <td>
                <Text heirarchy={heirarchy} isCenterAligned size={size}>
                  test
                </Text>
              </td>
            ))}
          </tr>
        ))}
      </Table>
    </>
  ),
};

const Table = styled.table`
  min-width: 400px;

  td > p {
    text-align: center;
  }

  th {
    padding: 16px 8px;
    text-align: center;
  }

  & > tr:first-child > th {
    border-bottom: solid lightgrey 1px;
  }

  & > tr > th:first-child {
    border-right: solid lightgrey 1px;
  }
`;

export default meta;
