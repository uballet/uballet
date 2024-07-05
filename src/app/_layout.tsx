import { Slot } from 'expo-router';
import AuthProvider from '../providers/AuthProvider';
import { AccountProvider } from '../providers/AccountProvider';
import { useNotificationObserver } from '../notifications/observer';
import { registerForPushNotificationsAsync } from '../notifications/register';
import { QueryProvider } from '../providers/QueryProvider';

export default function App() {
  if (process.env.EXPO_PUBLIC_STORYBOOK === "true") {
    const Storybook = require("./../../.storybook").default;

    return <Storybook />
  }

  registerForPushNotificationsAsync()
  useNotificationObserver();
  return (
    <QueryProvider>
      <AuthProvider>
        <AccountProvider>
          <Slot />
        </AccountProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
