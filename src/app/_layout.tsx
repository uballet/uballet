import { Slot } from "expo-router";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import { useNotificationObserver } from "../notifications/observer";
import { registerForPushNotificationsAsync } from "../notifications/register";
import { AccountProvider } from "../providers/AccountProvider";
import AuthProvider from "../providers/AuthProvider";
import { theme } from "../styles/color";

export default function App() {
  if (process.env.EXPO_PUBLIC_STORYBOOK === "true") {
    const Storybook = require("./../../.storybook").default;

    return <Storybook />;
  }

  registerForPushNotificationsAsync();
  useNotificationObserver();
  return (
    <AuthProvider  >
      <AccountProvider >
        <PaperProvider theme={theme}>
          <Slot />
        </PaperProvider>
      </AccountProvider>
    </AuthProvider>
  );
}
