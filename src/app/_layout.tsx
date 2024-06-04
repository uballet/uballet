import { Slot } from 'expo-router';
import AuthProvider from '../providers/AuthProvider';

export default function App() {
  if (process.env.EXPO_PUBLIC_STORYBOOK === "true") {
    const Storybook = require("./../../.storybook").default;

    return <Storybook />
  }
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
