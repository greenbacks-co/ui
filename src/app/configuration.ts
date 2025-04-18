const defaultConfiguration: Configuration = {
  apiHost: 'https://api.greenbacks.app',
  areWidgetsVisible: false,
  isTestData: false,
};

const configurationOverrides: AllOptionalConfiguration = {};

export const configuration: Configuration = {
  ...defaultConfiguration,
  ...configurationOverrides,
};

export interface Configuration {
  apiHost: string;
  areWidgetsVisible: boolean;
  isTestData: boolean;
}

export default configuration;
