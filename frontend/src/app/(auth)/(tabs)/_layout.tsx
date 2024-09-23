import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { MaterialIcons } from "@expo/vector-icons";
import { Stack, withLayoutContext } from "expo-router";
import {
  createMaterialBottomTabNavigator,
  MaterialBottomTabNavigationOptions,
} from "react-native-paper/react-navigation";
import { useAllNotifications } from "../../../hooks/notifications/useAllNotifications";
import { View } from "react-native";

const { Navigator } = createMaterialBottomTabNavigator();
export const MaterialBottomTabs = withLayoutContext<
  MaterialBottomTabNavigationOptions,
  typeof Navigator,
>(Navigator);

function TabsLayout() {
  const notificationsQuery = useAllNotifications();
  const unseenNotification = notificationsQuery.data?.find(n => !n.seen)
  return (
    <>
    <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
    <MaterialBottomTabs initialRouteName="index" 
    activeColor="#f0edf6"
    inactiveColor="#113547"
    barStyle={{ backgroundColor: '#277ca5' }}
  >
      <MaterialBottomTabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" size={24} color={color} />
          ),
        }}
      />
      <MaterialBottomTabs.Screen
        name="transfer"
        options={{
          title: "Transfer",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="compare-arrows" size={24} color={color} />
          ),
        }}
      />
      <MaterialBottomTabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="settings" size={24} color={color} />
          ),
        }}
      />
      <MaterialBottomTabs.Screen
        name="balance"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="balance" size={24} color={color} />
          ),
        }}
      />
      <MaterialBottomTabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarIcon: ({ color }) => (
            // <View className={`rounded-full p-2 $`}>
              <View>
                {unseenNotification && <View className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full z-50"></View>}
                <MaterialIcons name="notifications" size={24} color={color} />
              </View>
          ),
        }}
      />
      <MaterialBottomTabs.Screen
        name="security"
        options={{
          title: "Security",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="security" size={24} color={color} />
          ),
        }}
      />
    </MaterialBottomTabs>
    </>
  );
}

export default TabsLayout;
