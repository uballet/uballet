import React from 'react';
import { View, Text } from 'react-native';
import styles from '../../../styles/styles';

const BalanceScreen: React.FC = () => {
  return (
    <View style={styles.balanceScreenContainer}>
      <Text style={styles.balanceScreenHeader}>Balance</Text>
      <View style={styles.balanceItem}>
        <Text style={styles.currency}>Ethereum</Text>
        <Text style={styles.balanceAmount}>0.0023 ETH</Text>
      </View>
      <View style={styles.balanceItem}>
        <Text style={styles.currency}>Zarazeum</Text>
        <Text style={styles.balanceAmount}>0.0023 ZAR</Text>
      </View>
      <View style={styles.balanceItem}>
        <Text style={styles.currency}>Cualquierum</Text>
        <Text style={styles.balanceAmount}>0.0023 CUA</Text>
      </View>
      <View style={styles.balanceItem}>
        <Text style={styles.currency}>Otromaseum</Text>
        <Text style={styles.balanceAmount}>0.0023 OTM</Text>
      </View>
    </View>
  );
};

export default BalanceScreen;