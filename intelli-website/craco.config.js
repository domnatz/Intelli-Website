const webpack = require('webpack');
const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Existing fallback configurations
      webpackConfig.resolve.fallback = {
        path: require.resolve('path-browserify'),
        os: require.resolve('os-browserify/browser'),
        crypto: require.resolve('crypto-browserify'),
        buffer: require.resolve('buffer/'),
        stream: require.resolve('stream-browserify'),
        vm: require.resolve('vm-browserify'),
        // Add more fallbacks if needed based on error messages
      };

      // Handle potential DefinePlugin conflicts
      const existingDefinePluginIndex = webpackConfig.plugins.findIndex(
        plugin => plugin instanceof webpack.DefinePlugin
      );

      if (existingDefinePluginIndex !== -1) {
        // If a DefinePlugin already exists, merge the new definitions into it
        const existingDefinePlugin = webpackConfig.plugins[existingDefinePluginIndex];
        const existingDefinitions = existingDefinePlugin.definitions['process.env'];
        const newDefinitions = {
          NODE_ENV: process.env.NODE_ENV || 'development',
          REACT_BACKEND_API: process.env.REACT_BACKEND_API,
          // Add other environment variables here
        };

        // Merge the definitions, giving priority to the new ones
        const mergedDefinitions = { ...existingDefinitions, ...newDefinitions };
        existingDefinePlugin.definitions['process.env'] = JSON.stringify(mergedDefinitions);
      } else {
        // If no DefinePlugin exists, add a new one
        webpackConfig.plugins.push(
          new webpack.DefinePlugin({
            'process.env': JSON.stringify({
              NODE_ENV: process.env.NODE_ENV || 'development',
              REACT_BACKEND_API: process.env.REACT_BACKEND_API,
              MONGODB_CONNECTION: process.env.MONGODB_CONNECTION,
              // Add other environment variables here
            }),
          })
        );
      }

      // ProvidePlugin to polyfill 'process'
      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser',
        })
      );

      return webpackConfig;
    },
  },
};