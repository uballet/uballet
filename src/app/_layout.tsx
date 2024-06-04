import React, { useEffect, useRef, useState } from 'react';
import { Slot } from 'expo-router';
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from './notifications/register';

export default function App() {
  if (process.env.EXPO_PUBLIC_STORYBOOK === "true") {
    const Storybook = require("./../../.storybook").default;

    return <Storybook />
  }
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
  const notificationListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? ''))
      .catch((error: any) => setExpoPushToken(`${error}`));

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    return () => {
      notificationListener.current && Notifications.removeNotificationSubscription(notificationListener.current);
    };
  }, []);

  return (
    <Slot />
  );
}
