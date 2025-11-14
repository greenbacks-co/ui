import React, { FC } from 'react';

const PageWrapper: FC<Props> = ({ children, name }) => (
  <main data-testid={`${name}-page`}>{children}</main>
);

interface Props {
  name: string;
}

export default PageWrapper;
