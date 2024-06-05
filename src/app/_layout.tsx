import { Slot } from 'expo-router';
import AuthProvider from '../providers/AuthProvider';
import { AccountProvider } from '../providers/AccountProvider';

export default function App() {
  if (process.env.EXPO_PUBLIC_STORYBOOK === "true") {
    const Storybook = require("./../../.storybook").default;

    return <Storybook />
  }
  return (
    <AuthProvider>
      <AccountProvider>
        <Slot />
      </AccountProvider>
    </AuthProvider>
  );
}
