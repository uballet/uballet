import { useEffect } from "react";
import { FlatList, SafeAreaView, View } from "react-native";
import { useAllNotifications } from "../../../hooks/notifications/useAllNotifications";
import { ActivityIndicator, Card, Text } from "react-native-paper";
import { Notification } from "../../../api/uballet/types";
import { useSetNotificationsSeen } from "../../../hooks/notifications/useSetNotificationsSeen";
import { Ionicons } from "@expo/vector-icons";

function RenderNotification({ notification }: { notification: Notification }) {
  return (
    <Card
      className={`w-full flex-col p-2 mb-2 ${
        notification.seen && "bg-gray-200"
      }`}
    >
      <View className="flex-row justify-between">
        <Text className="my-2 font-semibold">{notification.title}</Text>
        <Text>{notification.createdAt.toLocaleString()}</Text>
      </View>
      <View>
        <Text>{notification.body}</Text>
      </View>
    </Card>
  );
}

function NotificationScreen() {
  const { data, isLoading } = useAllNotifications();
  const setNotificationsSeen = useSetNotificationsSeen();
  useEffect(() => {
    if (data) {
      if (data.length && !data[0].seen) {
        setTimeout(() => {
          if (data.length && !data[0].seen) {
            setNotificationsSeen.mutate({ lastNotificationId: data[0].id });
          }
        }, 5000);
      }
    }
  }, [data, !!data?.[0]?.seen]);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <FlatList
        className="flex-1 pt-6"
        data={data}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center p-2">
            <Ionicons name="notifications" size={80} color="gray" />
            <Text className="text-2xl font-bold text-gray-600 mb-2">
              No notifications yet
            </Text>
            <Text className="text-md text-gray-500 text-center px-8">
              Here will be displayed all the notifications you receive.
            </Text>
          </View>
        }
        renderItem={({ item }) => <RenderNotification notification={item} />}
      />
    </SafeAreaView>
  );
}

export default NotificationScreen;
