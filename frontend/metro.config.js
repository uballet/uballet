// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require("path");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  ...require("node-libs-react-native"),
  crypto: require.resolve("crypto-browserify"),
  stream: require.resolve("stream-browserify"),
};

if (process.env.STORYBOOK === "true") {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { generate } = require("@storybook/react-native/scripts/generate");
  
    generate({
      configPath: path.resolve("./.storybook"),
    });
}

module.exports = config;
