export default {
  expo: {
    name: "uballet",
    slug: "uballet",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.uballet.wallet",
    },
    android: {
      package: "com.uballet.wallet",
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      eas: {
        projectId: "5041aad6-cc9f-4375-9021-c586d07c1e91",
      },
    },
    owner: "uballet",
    plugins: ["expo-router"],
    scheme: "uballet",
  },
};
