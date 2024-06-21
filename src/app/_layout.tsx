import { Slot } from 'expo-router';
import AuthProvider from '../providers/AuthProvider';
import { AccountProvider } from '../providers/AccountProvider';
import { useNotificationObserver } from '../notifications/observer';
import { registerForPushNotificationsAsync } from '../notifications/register';

export default function App() {
  if (process.env.EXPO_PUBLIC_STORYBOOK === "true") {
    const Storybook = require("./../../.storybook").default;

    return <Storybook />
  }

  registerForPushNotificationsAsync()
  useNotificationObserver();
  return (
    <AuthProvider>
      <AccountProvider>
        <Slot />
      </AccountProvider>
    </AuthProvider>
  );
}
