const rewireStyledComponents = require('react-app-rewire-styled-components');
const rewireReactHotLoader = require('react-app-rewire-hot-loader');

module.exports = {
  webpack: function(config, env) {
    config = rewireStyledComponents(config, env, {
      ssr: true,
      fileName: false,
      displayName: true
    });
    config = rewireReactHotLoader(config, env);

    return config;
  }
};
