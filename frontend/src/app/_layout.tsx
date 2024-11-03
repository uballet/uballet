import { Slot } from "expo-router";
import {
  PaperProvider,
} from "react-native-paper";
import { QueryProvider } from '../providers/QueryProvider';
import { useNotificationObserver } from "../notifications/observer";
import { AccountProvider } from "../providers/AccountProvider";
import { BlockchainProvider } from "../providers/BlockchainProvider";
import AuthProvider from "../providers/AuthProvider";
import { theme } from "../styles/color";
import "node-libs-react-native/globals.js";
import "react-native-get-random-values";
import { IS_STORYBOOK } from "../env";
import { PushNotificationProvider } from "../providers/PushNotificationProvider";
import { UsdcContractProvider } from "../providers/UsdcContractProvider";

export default function App() {
  if (IS_STORYBOOK) {
    const Storybook = require("./../../.storybook").default;

    return <Storybook />;
  }

  useNotificationObserver();
  return (
    <QueryProvider>
        <BlockchainProvider>
          <AuthProvider>
            <UsdcContractProvider>
              <PushNotificationProvider>
                <AccountProvider >
                    <PaperProvider theme={theme}>
                      <Slot />
                    </PaperProvider>          
                </AccountProvider>
              </PushNotificationProvider>
            </UsdcContractProvider>
          </AuthProvider>
        </BlockchainProvider>
      </QueryProvider>
  );
}
