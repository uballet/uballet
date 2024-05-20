import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from './screens/HomeScreen';
import styles from './styles/styles';

type PlaceholderScreenProps = {
  name: string;
};

const Tab = createBottomTabNavigator();

const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({ name }) => (
  <View style={styles.container}>
    <Text>{name} Screen</Text>
  </View>
);

const App: React.FC = () => (
  <NavigationContainer>
    <StatusBar style="auto" />
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Something1') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Transfer') {
            iconName = focused ? 'swap-horizontal' : 'swap-horizontal-outline';
          } else if (route.name === 'Browser') {
            iconName = focused ? 'globe' : 'globe-outline';
          } else if (route.name === 'Something2') {
            iconName = focused ? 'ellipsis-horizontal' : 'ellipsis-horizontal-outline';
          }
          return <Ionicons name={iconName as string} size={size} color={color} />;
        },
        tabBarLabel: () => null,
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Something1" component={() => <PlaceholderScreen name="Something1" />} />
      <Tab.Screen name="Transfer" component={() => <PlaceholderScreen name="Transfer" />} />
      <Tab.Screen name="Browser" component={() => <PlaceholderScreen name="Browser" />} />
      <Tab.Screen name="Something2" component={() => <PlaceholderScreen name="Something2" />} />
    </Tab.Navigator>
  </NavigationContainer>
);

export default App;
