import { Slot } from 'expo-router';

export default function App() {
  if (process.env.EXPO_PUBLIC_STORYBOOK === "true") {
    const Storybook = require("./../../.storybook").default;

    return <Storybook />
  }
  return (
    <Slot />
  );
}
