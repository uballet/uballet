import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { MaterialIcons } from "@expo/vector-icons";
import { Stack, withLayoutContext } from "expo-router";
import {
  createMaterialBottomTabNavigator,
  MaterialBottomTabNavigationOptions,
} from "react-native-paper/react-navigation";

const { Navigator } = createMaterialBottomTabNavigator();
export const MaterialBottomTabs = withLayoutContext<
  MaterialBottomTabNavigationOptions,
  typeof Navigator
>(Navigator);

function TabsLayout() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <MaterialBottomTabs
        initialRouteName="index"
        activeColor="#f0edf6"
        inactiveColor="#113547"
        barStyle={{ backgroundColor: "#277ca5" }}
      >
        <MaterialBottomTabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="home" size={24} color={color} />
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
              <MaterialIcons name="notifications" size={24} color={color} />
            ),
          }}
        />
      </MaterialBottomTabs>
    </>
  );
}

export default TabsLayout;
