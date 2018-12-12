let environments = {};

// Staging (default) environment
environments.development = {
  'port' : 3000,
  'envName' : 'development'
};

// Production environment
environments.production = {
  'port' : 5000,
  'envName' : 'production'
};

// Determine which environment was passed as a command-line argument
const currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above, if not default to staging
const environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments['development'];

module.exports = environmentToExport;
