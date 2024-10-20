import { useEffect } from "react";
import { FlatList, SafeAreaView, View } from "react-native";
import { useAllNotifications } from "../../../hooks/notifications/useAllNotifications";
import { ActivityIndicator, Text } from "react-native-paper";
import { Notification } from "../../../api/uballet/types";
import { useSetNotificationsSeen } from "../../../hooks/notifications/useSetNotificationsSeen";


function RenderNotification({ notification }: { notification: Notification }) {
  return (
    <View className={`w-full flex-col p-2 border-b ${notification.seen && 'bg-gray-200'}`}>
      <View className="flex-row justify-between">
        <Text className="my-2 font-semibold">{notification.title}</Text>
        <Text>{notification.createdAt.toLocaleString()}</Text>
      </View>
      <View>
        <Text>{notification.body}</Text>
      </View>
    </View>
  )
}

function NotificationScreen() {
  const { data, isLoading } = useAllNotifications();
  const setNotificationsSeen = useSetNotificationsSeen();
  useEffect(() => {
    if (data) {
      if (data.length && !data[0].seen) {
        setTimeout(() => {
          if (data.length && !data[0].seen) {
            setNotificationsSeen.mutate({ lastNotificationId: data[0].id })
          }
        }, 5000)
      }
    }
  }, [data, !!data?.[0]?.seen])

  if (isLoading) {
    return <ActivityIndicator />;
  }
  
  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <FlatList
        className="flex-1"
        data={data}
        ListEmptyComponent={<Text className="text-xl">No notifications yet</Text>}
        renderItem={({ item }) => <RenderNotification notification={item}/>}
      />
    </SafeAreaView>
  );
}

export default NotificationScreen;
