import React, { useState } from "react";
import * as Notifications from "expo-notifications";
import { Text, View } from "react-native";

function NotificationScreen() {
  const [notifications, setNotifications] = useState<
    Notifications.Notification[] | undefined
  >(undefined);
  Notifications.getPresentedNotificationsAsync().then((response) => {
    setNotifications(response);
  });
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Notifications</Text>
      {notifications?.map((notification) => (
        <Text key={notification.request.identifier}>
          {notification.request.content.title}
        </Text>
      ))}
    </View>
  );
}

export default NotificationScreen;
