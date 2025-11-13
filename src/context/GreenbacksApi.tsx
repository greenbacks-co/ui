import React, { FC, useEffect, useMemo, useState } from 'react';
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  from,
  InMemoryCache,
  NormalizedCacheObject,
  ServerError,
} from '@apollo/client';
import { SchemaLink } from '@apollo/client/link/schema';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { DateTime } from 'luxon';

import { useAuth } from 'auth';
import { Page } from 'components/Page';
import useIsAuthenticated from 'hooks/useIsAuthenticated';
import useLogout from 'hooks/useLogout';
import useNow from 'hooks/useNow';
import { generateTransactions } from 'utils/generateTransactions';
import LoadingIndicator from '../components/atoms/LoadingIndicator';

export { GraphQLError } from 'graphql';

interface ApiContext {
  isReady: boolean;
}

export const GreenbacksApiContext = React.createContext<ApiContext>({
  isReady: false,
});

export const HttpApiProvider: FC<Props> = ({ children, uri }) => {
  const { isAuthenticated } = useIsAuthenticated();
  const { logout } = useLogout();
  const { getAccessTokenSilently } = useAuth();
  const [token, setToken] = useState<string>();

  const client = useMemo(() => {
    if (!token) return undefined;
    return getClient({ onAuthError: logout, token, uri });
  }, [logout, token, uri]);

  useEffect(() => {
    if (getAccessTokenSilently && isAuthenticated) {
      const saveToken = async () => {
        const accessToken = await getAccessTokenSilently();
        setToken(accessToken);
      };
      saveToken();
    }
  }, [getAccessTokenSilently, isAuthenticated]);

  if (!client)
    return (
      <Page hasLinks={false}>
        <LoadingIndicator />
      </Page>
    );

  return (
    <ApolloProvider client={client}>
      <InnerProvider client={client}>{children}</InnerProvider>
    </ApolloProvider>
  );
};

interface Props {
  uri: string;
}

const getClient = ({
  onAuthError,
  token,
  uri,
}: {
  onAuthError: () => void;
  token: string;
  uri: string;
}) => {
  const authLink = setContext((_, { headers }) => {
    const result = {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    };
    return result;
  });
  const errorLink = onError(({ networkError }) => {
    const error = networkError as ServerError | undefined;
    if (!error?.result) return;
    const errorCode = error?.result.statusCode;
    if (errorCode === 401) onAuthError();
  });
  const httpLink = createHttpLink({ uri });
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: from([authLink, errorLink, httpLink]), // httpLink has to be last
  });
};

const InnerProvider: FC<InnerProps> = ({ children, client }) => {
  const isReady = !!client;
  return (
    <GreenbacksApiContext.Provider
      value={{
        isReady,
      }}
    >
      {children}
    </GreenbacksApiContext.Provider>
  );
};

interface InnerProps {
  client?: ApolloClient<NormalizedCacheObject>;
}

export const TestGreenbacksApiProvider: FC<TestProps> = ({
  children,
  isReady,
  mocks,
}) => (
  <MockedProvider mocks={mocks}>
    <TestInnerProvider isReady={isReady}>{children}</TestInnerProvider>
  </MockedProvider>
);

interface TestProps {
  isReady?: boolean;
  mocks?: MockedApiResponse[];
}

const TestInnerProvider: FC<TestInnerProps> = ({
  children,
  isReady = true,
}) => (
  <GreenbacksApiContext.Provider value={{ isReady }}>
    {children}
  </GreenbacksApiContext.Provider>
);

interface TestInnerProps {
  isReady?: boolean;
}

export interface Transaction {
  amount: number;
  datetime: string;
  merchant: string;
  name: string;
}

export type MockedApiResponse = MockedResponse;

export function DemoApiProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const { now } = useNow();
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new SchemaLink({
      schema: makeExecutableSchema({
        typeDefs: DEMO_TYPE_DEFS,
        resolvers: {
          Query: {
            accounts: () => [
              {
                createdDate: '2020-01-01',
                id: 'account-1',
                institution: { name: 'RBC' },
                isReauthenticationRequired: false,
                modifiedDate: '2020-01-01',
              },
            ],
            transactions: (
              _,
              {
                input: {
                  endDate = now.endOf('month').toISODate(),
                  startDate = now.startOf('month').toISODate(),
                },
              }: {
                input: {
                  endDate?: string;
                  startDate?: string;
                };
              },
            ) => {
              const generatedTransactions = generateTransactions({
                endDate: DateTime.fromISO(endDate),
                startDate: DateTime.fromISO(startDate),
              });
              return generatedTransactions;
            },
          },
        },
      }),
    }),
  });
  return (
    <ApolloProvider client={client}>
      <InnerProvider>{children}</InnerProvider>
    </ApolloProvider>
  );
}

const DEMO_TYPE_DEFS = `#graphql
  type Account {
    createdDate: String!
    id: ID!
    institution: Institution!
    isReauthenticationRequired: Boolean!
    modifiedDate: String!
  }

  enum Category {
    Earning
    Hidden
    Saving
    Spending
  }

  enum Comparator {
    Equals
    GreaterThan
    LessThan
  }

  type Filter {
    categoryToAssign: Category!
    id: ID!
    matchers: [Matcher]!
    tagToAssign: String
  }

  type Institution {
    name: String!
  }

  type Matcher {
    comparator: Comparator
    expectedValue: String!
    property: String!
  }

  type Transaction {
    accountId: ID!
    amount: Int!
    id: ID!
    datetime: String!
    merchant: String
    name: String!
  }

  input GetTransactionsInput {
    endDate: String!
    startDate: String!
  }

  type Query {
    accounts: [Account]
    transactions(input: GetTransactionsInput): [Transaction]
  }
`;

export default HttpApiProvider;
