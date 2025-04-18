import React, { FunctionComponent } from 'react';
import { Route, Routes } from 'react-router-dom';

import { configuration } from 'app/configuration';
import Greenbacks from 'components/Greenbacks';
import AccountConnectionProvider from 'context/AccountConnection';
import AuthProvider from 'context/Auth';
import { ApiFiltersProvider, MemoryFiltersProvider } from 'context/Filters';
import { DemoApiProvider, HttpApiProvider } from 'context/GreenbacksApi';
import RouteProvider from 'context/Route';
import { UserSettingsProvider } from 'context/UserSettings';
import GlobalStyle from 'styles/GlobalStyle';

const App: FunctionComponent = () => (
  <RouteProvider>
    <Routes>
      <Route
        path="/demo/*"
        element={
          <DemoApiProvider>
            <MemoryFiltersProvider>
              <UserSettingsProvider
                areWidgetsInitiallyVisible={configuration.areWidgetsVisible}
              >
                <GlobalStyle />
                <Greenbacks />
              </UserSettingsProvider>
            </MemoryFiltersProvider>
          </DemoApiProvider>
        }
      />
      <Route
        path="*"
        element={
          <AuthProvider>
            <HttpApiProvider uri={`${configuration.apiHost}/graphql`}>
              <AccountConnectionProvider>
                <ApiFiltersProvider>
                  <UserSettingsProvider
                    areWidgetsInitiallyVisible={configuration.areWidgetsVisible}
                  >
                    <GlobalStyle />
                    <Greenbacks />
                  </UserSettingsProvider>
                </ApiFiltersProvider>
              </AccountConnectionProvider>
            </HttpApiProvider>
          </AuthProvider>
        }
      />
    </Routes>
  </RouteProvider>
);

export default App;
