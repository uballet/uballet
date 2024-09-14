import { Slot } from "expo-router";
import {
  PaperProvider,
} from "react-native-paper";
import { QueryProvider } from '../providers/QueryProvider';
import { useNotificationObserver } from "../notifications/observer";
import { registerForPushNotificationsAsync } from "../notifications/register";
import { AccountProvider } from "../providers/AccountProvider";
import AuthProvider from "../providers/AuthProvider";
import { theme } from "../styles/color";
import "node-libs-react-native/globals.js";
import "react-native-get-random-values";
import { IS_STORYBOOK } from "../env";
import { PushNotificationProvider } from "../providers/PushNotificationProvider";

export default function App() {
  if (IS_STORYBOOK) {
    const Storybook = require("./../../.storybook").default;

    return <Storybook />;
  }

  useNotificationObserver();
  return (
    <QueryProvider>
      <AuthProvider  >
        <PushNotificationProvider>
        <AccountProvider >
          <PaperProvider theme={theme}>
            <Slot />
          </PaperProvider>
        </AccountProvider>
        </PushNotificationProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
