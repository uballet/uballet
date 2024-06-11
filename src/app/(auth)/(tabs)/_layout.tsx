import React from 'react';
import { Tabs } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { MaterialIcons } from '@expo/vector-icons';

function TabsLayout() {
    return (
        <Tabs initialRouteName="index">
            <Tabs.Screen name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => <AntDesign name="home" size={24} color={color} />,
                }}
            />
            <Tabs.Screen name="transfer"
                options={{
                    title: "Transfer",
                    tabBarIcon: ({ color }) => <MaterialIcons name="compare-arrows" size={24} color={color} />,
                }}
            />
            <Tabs.Screen name="settings"
                options={{
                    title: "Settings",
                    tabBarIcon: ({ color }) => <MaterialIcons name="settings" size={24} color={color} />,
                }}
            />
            <Tabs.Screen name="balance"
                options={{
                    tabBarButton: () => null,
                }}
            />
            <Tabs.Screen name="notifications"
                options={{
                    title: "Notifications",
                    tabBarIcon: ({ color }) => <MaterialIcons name="notifications" size={24} color={color} />,
                }}
            />
        </Tabs>
    )
}

export default TabsLayout;

