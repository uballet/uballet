import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type PlaceholderScreenProps = {
  name: string;
};

const Tab = createBottomTabNavigator();

const HomeScreen: React.FC = () => (
  <ScrollView contentContainerStyle={styles.container}>
    <View style={styles.userSettings}>
      <Ionicons name="person-circle-outline" size={30} />
    </View>
    <Text style={styles.balance}>0.0023 ETH</Text>
    <View style={styles.keyFeatures}>
      <View style={styles.featureCircle}></View>
      <View style={styles.featureCircle}></View>
      <View style={styles.featureCircle}></View>
      <View style={styles.featureCircle}></View>
    </View>
    <View style={styles.movements}>
      <Text style={styles.movementsHeader}>Movements</Text>
      {[...Array(6)].map((_, index) => (
        <View key={index} style={styles.movementRow}>
          <Text>Some address - 10/11/12 12:00am</Text>
          <Text style={styles.amount}>-0.0523</Text>
        </View>
      ))}
    </View>
  </ScrollView>
);

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
        tabBarShowLabel: false, // Deprecated, not used
        tabBarLabel: () => null, // This hides the label
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  userSettings: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  balance: {
    fontSize: 24,
    marginVertical: 20,
  },
  keyFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  featureCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
  },
  movements: {
    width: '100%',
    marginTop: 20,
  },
  movementsHeader: {
    fontSize: 18,
    marginBottom: 10,
  },
  movementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  amount: {
    color: 'red',
  },
});

export default App;
