import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from './screens/HomeScreen';
import BalanceScreen from './screens/BalanceScreen';
import styles from './styles/styles';
type PlaceholderScreenProps = {
  name: string;
};

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({ name }) => (
  <View style={styles.container}>
    <Text>{name} Screen</Text>
  </View>
);

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Balance" component={BalanceScreen} />
  </Stack.Navigator>
);

const App: React.FC = () => (
  <NavigationContainer>
    <StatusBar style="auto" />
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
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
          } else if (route.name === 'More') {
            iconName = focused ? 'ellipsis-horizontal' : 'ellipsis-horizontal-outline';
          }
          return <Ionicons name={iconName as string} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Something1" component={() => <PlaceholderScreen name="Something1" />} />
      <Tab.Screen name="Transfer" component={() => <PlaceholderScreen name="Transfer" />} />
      <Tab.Screen name="Browser" component={() => <PlaceholderScreen name="Browser" />} />
      <Tab.Screen name="More" component={() => <PlaceholderScreen name="More" />} />
    </Tab.Navigator>
  </NavigationContainer>
);

export default App;
