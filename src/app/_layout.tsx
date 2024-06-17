import { Slot } from "expo-router";
import React from "react";
import { useNotificationObserver } from "../notifications/observer";
import { registerForPushNotificationsAsync } from "../notifications/register";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "tomato",
    secondary: "yellow",
  },
};

export default function App() {
  if (process.env.EXPO_PUBLIC_STORYBOOK === "true") {
    const Storybook = require("./../../.storybook").default;

    return <Storybook />;
  }

  registerForPushNotificationsAsync();
  useNotificationObserver();
  return (
    <PaperProvider theme={theme}>
      <Slot />
    </PaperProvider>
  );
}
