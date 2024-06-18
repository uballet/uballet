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
    primary: '#4CAF50',        // Green primary color
    onPrimary: '#FFFFFF',      // Text color on primary color
    primaryContainer: '#DCEDC8', // Light green for primary container
    onPrimaryContainer: '#212121', // Text color on primary container

    secondary: '#81C784',      // Secondary green color
    onSecondary: '#FFFFFF',    // Text color on secondary color
    secondaryContainer: '#E8F5E9', // Light green for secondary container
    onSecondaryContainer: '#388E3C', // Text color on secondary container

    background: '#F1F8E9',     // Light green background
    onBackground: '#1B5E20',   // Text color on background
    surface: '#FFFFFF',        // Surface color
    onSurface: '#212121',      // Text color on surface
    
    error: '#B00020',          // Error color
    onError: '#FFFFFF',        // Text color on error color
    errorContainer: '#FDECEA', // Error container color
    onErrorContainer: '#B00020', // Text color on error container
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
