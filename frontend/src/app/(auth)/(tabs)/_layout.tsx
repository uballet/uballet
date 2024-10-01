
import { View, StatusBar, SafeAreaView, Platform } from "react-native";
import { Text, Avatar } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { withLayoutContext } from "expo-router";
import {
  createMaterialBottomTabNavigator,
  MaterialBottomTabNavigationOptions,
} from "react-native-paper/react-navigation";
import { useAllNotifications } from "../../../hooks/notifications/useAllNotifications";
import { useBlockchainContext } from "../../../providers/BlockchainProvider";

const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

const { Navigator } = createMaterialBottomTabNavigator();
export const MaterialBottomTabs = withLayoutContext<
  MaterialBottomTabNavigationOptions,
  typeof Navigator
>(Navigator);

function TabsLayout() {
  const { blockchain } = useBlockchainContext();
  const notificationsQuery = useAllNotifications();
  const unseenNotification = notificationsQuery.data?.find(n => !n.seen)

  return (
    <>
      <StatusBar backgroundColor="#000" barStyle="light-content" />

      <SafeAreaView style={{ flex: 1, backgroundColor: "#277ca5" }}>
        <View
          style={{
            paddingTop: statusBarHeight,
            backgroundColor: "#277ca5",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingRight: 10,
          }}
        >
          <Avatar.Icon size={20} icon="link" />
          <Text variant="titleSmall" style={{ color: "#fff" }}>
            Network:
          </Text>
          <Text
            variant="titleMedium"
            style={{
              color: "#fff",
              fontWeight: "bold",
              marginLeft: 4,
            }}
          >
            {blockchain.name}
          </Text>
        </View>

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
      </SafeAreaView>
    </>
  );
}

export default TabsLayout;
