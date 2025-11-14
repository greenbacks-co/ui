import React, { FC } from 'react';

import MonthlySummary from './MonthlySummary';
import PageWrapper from '../molecules/PageWrapper';

const Home: FC = () => (
  <PageWrapper name="home">
    <MonthlySummary />
  </PageWrapper>
);

export default Home;
