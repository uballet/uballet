// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require("path");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

if (process.env.STORYBOOK === "true") {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { generate } = require("@storybook/react-native/scripts/generate");
  
    generate({
      configPath: path.resolve("./.storybook"),
    });
}

module.exports = config;
