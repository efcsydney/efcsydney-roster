const rewireStyledComponents = require('react-app-rewire-styled-components');
const rewireReactHotLoader = require('react-app-rewire-hot-loader');
const {
  rewireWebpack: rewireTypescript,
  rewireJest: rewireTypescriptJest,
  rewireTSLint
} = require('react-app-rewire-typescript-babel-preset');

module.exports = {
  webpack: function(config, env) {
    config = rewireTypescript(config);
    config = rewireStyledComponents(config, env, {
      ssr: true,
      fileName: false,
      displayName: true
    });
    config = rewireReactHotLoader(config, env);
    config = rewireTSLint(config);

    return config;
  },
  jest: function(config) {
    return rewireTypescriptJest(config);
  }
};
