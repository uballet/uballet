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
      bundleIdentifier: "com.flperez.uballet",
      associatedDomains: [
        "webcredentials:uballet-backend-dot-outstanding-map-428001-f5.uc.r.appspot.com",
        "webcredentials:uballet-server.onrender.com"
      ]
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
    plugins: [
      "expo-router",
      [
        "expo-camera",
        {
          "cameraPermission": "Allow Uballet to access your camera",
          "microphonePermission": "Allow Uballet to access your microphone",
          "recordAudioAndroid": true
        }
      ]
    ],
    scheme: "uballet",
  },
};
