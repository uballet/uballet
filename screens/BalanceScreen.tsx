import React from 'react';
import { View, Text } from 'react-native';
import styles from '../styles/styles';

const BalanceScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.balanceHeader}>Balance Details</Text>
      <Text> lorem ipsum </Text>
    </View>
  );
};

export default BalanceScreen;