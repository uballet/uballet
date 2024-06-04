import { Slot } from 'expo-router';
import React from 'react';
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
    <Slot />
  );
}
