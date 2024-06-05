import React from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Link } from 'expo-router';
import styles from '../../../styles/styles';
import { useBalance } from '../../../hooks/useBalance';

const HomeScreen: React.FC = () => {
  const balance = useBalance()

  console.log({ balance })
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.userSettings}>
        <Ionicons name="person-circle-outline" size={30} />
      </View>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceHeader}>Balance</Text>
        {balance !== null
          ? (<Text style={styles.balance}>{balance?.toString()} eth</Text>)
          : <ActivityIndicator />
        }
        <Link href="balance" style={styles.seeAll}>
          <Text>See all</Text>
        </Link>
      </View>
      <View style={styles.keyFeatures}>
        <View style={styles.featureCircle}></View>
        <View style={styles.featureCircle}></View>
        <View style={styles.featureCircle}></View>
        <View style={styles.featureCircle}></View>
      </View>
      <View style={styles.movementsContainer}>
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
};

export default HomeScreen;
